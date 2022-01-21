// const SERVER_URL = "http://localhost:3000/push-notification";
const SERVER_URL = "https://akvcloudapi.herokuapp.com/push-notification";
const VAPID_PUBLIC_KEY = "BHO_h5mRkL8oNzXk-SEZ2B8NCGJswQi5Ju7swcNipQ7v_ISPRJD3fhfM8UCMi9nHmSApGdMxU-Hy2ssFDrEBHT0";

const getSubscriptionOrSubscribe = async () => {
    let subscription = await self.registration.pushManager.getSubscription();
    if (!subscription) {
        const options = {
            applicationServerKey: VAPID_PUBLIC_KEY,
            userVisibleOnly: true
        }
        subscription = await self.registration
            .pushManager.subscribe(options)
    }
    return subscription;
}

const saveSubscriptionToServer = async () => {
    const subscription = await getSubscriptionOrSubscribe();
    let url = `${SERVER_URL}/save-subscription`;
    console.log(url)
    fetch(
        url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    })
        .then(res => res.text())
        .then((res) => {
            console.log(res);
        })
        .catch((err) => { console.log(err) });
}

const showNotificationSW = (title, options = {}) => {
    let _options = {
        body: "This is notification body",
        icon: "../../images/icons/seo128x128.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
        ...options
    };
    self.registration.showNotification(title, _options);
}

self.addEventListener('activate', async () => {
    try {
        saveSubscriptionToServer();
    } catch (err) {
        console.log(err)
    }
});

self.addEventListener("push", async (event) => {
    let data = event.data.json();
    showNotificationSW(data.title, data.options);
});