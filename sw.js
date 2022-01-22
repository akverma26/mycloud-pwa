// const SERVER_URL = "http://localhost:3000/push-notification";
const SERVER_URL = "https://akvcloudapi.herokuapp.com/push-notification";
const VAPID_PUBLIC_KEY = "BHO_h5mRkL8oNzXk-SEZ2B8NCGJswQi5Ju7swcNipQ7v_ISPRJD3fhfM8UCMi9nHmSApGdMxU-Hy2ssFDrEBHT0";
const CACHE_NAME = 'my-cloud-cache';
const SUBSCRIPTION_TYPE = 'default';

const saveSubscriptionToServer = async () => {
    const options = {
        applicationServerKey: VAPID_PUBLIC_KEY,
        userVisibleOnly: true
    }
    const subscription = await self.registration
        .pushManager.subscribe(options)
    let body = {
        type: SUBSCRIPTION_TYPE,
        value: subscription
    }
    console.log(JSON.stringify(body));
    fetch(
        `${SERVER_URL}/save-subscription`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
        vibrate: [1000, 500, 1000, 500, 1000, 500, 1000, 500],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
        ...options
    };
    self.registration.showNotification(title, _options);
}

const deleteCache = () => {
    return caches.keys().then(function (cacheNames) {
        return Promise.all(
            cacheNames.filter(c => (c == CACHE_NAME))
            .map(function (cacheName) {
                console.log("Deleting cache...")
                return caches.delete(cacheName);
            })
        );
    })
}

self.addEventListener('install', function (event) {
    console.log('Installing...')
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(
                []
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method != 'GET') return;
    event.respondWith(
        // On Get fetch request try to serve it from out cache
        caches.open(CACHE_NAME).then((cache) => {
            // Check if there is a match for our fetch request
            return cache.match(event.request).then((response) => {
                // If there is a match return response else fetch from network
                return response || fetch(event.request).then((response) => {
                    // Cache the response received from network and return
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        }).catch((err) => {
            console.log(err);
        })
    );
});

self.addEventListener('activate', async (event) => {
    try {
        saveSubscriptionToServer();
        event.waitUntil(deleteCache());
    } catch (err) {
        console.log(err)
    }
});

self.addEventListener("push", async (event) => {
    console.log("Push received...");
    let data = event.data.json();
    showNotificationSW(data.title, data.options);
});