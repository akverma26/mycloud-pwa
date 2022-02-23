// const SERVER_URL = "http://localhost:3000";
const SERVER_URL = "https://akvcloudapi.herokuapp.com";
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
        `${SERVER_URL}/push-notification/save-subscription`, {
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

// ===========================================================
// ================ Web Push Notification ====================
// ===========================================================

// Reference:
// https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#display_a_notification
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification

// Show web push notification on the device
const showWebPushNotification = (title = "Notification Title!", options = {}) => {
    let _options = {
        body: "Notification body.",
        icon: "../../images/icons/seo128x128.png",
        vibrate: [1000, 500, 1000, 500, 1000, 500, 1000, 500],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
        actions: [{
                action: 'explore',
                title: 'View'
            },
            {
                action: 'close',
                title: 'Close'
            },
        ],
        ...options
    };
    if (Notification.permission == 'granted') {
        self.registration.showNotification(title, _options);
    } else {
        console.log("Notification permission is not granted.");
    }
}

// Event listener for notification close
self.addEventListener('notificationclose', function (e) {
    // var notification = e.notification;
    // var primaryKey = notification.data.primaryKey;
});

// Event listener for notification click
self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    var action = e.action;
    if (action === 'close') {
        notification.close();
    } else {
        // clients.openWindow('http://www.example.com');
        clients.openWindow('/MyCloudPWA/');
        notification.close();
    }
});

// ============================================================
// ================ Service Worker Listeners ==================
// ============================================================

// Event listener, triggers when app is installed on the system.
// For now I am doing nothing, but I have added a template code
// to manage cache.
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

// Event listener, triggers when service worker gets registered
self.addEventListener('activate', async (event) => {
    console.log("Service worker getting activated...");
    try {
        saveSubscriptionToServer();
        event.waitUntil(deleteCache());
    } catch (err) {
        console.log(err)
    }
});

// Event listener, triggers when app requests for any resource
self.addEventListener('fetch', event => {
    if (event.request.method != 'GET') return;
    if (event.request.url.startsWith(SERVER_URL)) return;
    console.log(event.request.method, event.request.url);
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

// Event listener, triggers when we get push notification from the server
self.addEventListener("push", async (event) => {
    console.log("Push received...");
    let data = event.data.json();
    self.registration.getNotifications()
        .then((notifications) => {
            notifications.map((notification) => {
                notification.close();
            });
            showWebPushNotification(data.title, data.options);
        })
        .catch((err) => {
            console.log(err)
        });
});