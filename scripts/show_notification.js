const checkSupport = () => {
    if ('serviceWorker' in navigator) {
        document.querySelector(".support-check .service-worker .output")
            .innerHTML = "true";
    } else {
        document.querySelector(".support-check .service-worker .output")
            .innerHTML = "false";
    }
    if ('PushManager' in window) {
        document.querySelector(".support-check .push-manager .output")
            .innerHTML = "true";
    } else {
        document.querySelector(".support-check .push-manager .output")
            .innerHTML = "false";
    }
}

checkSupport();

document
    .querySelector(".check-notification-permission button")
    .addEventListener("click", (event) => {
        document.querySelector(".check-notification-permission .output")
            .innerHTML = Notification.permission;
        requestNotificationPermission();
    });

const requestNotificationPermission = () => {
    Notification.requestPermission().then((result) => {
        document.querySelector(".check-notification-permission .output")
            .innerHTML = Notification.permission;
        if (result === "granted") {
        }
    });
}

document
    .querySelector(".show-notification button")
    .addEventListener("click", (event) => {
        document
            .querySelector(".check-notification-permission button").click();
        showDummyNotification();
    });

const showNotification = (title, options = {}) => {
    new Notification(title, options)
}

const showDummyNotification = () => {
    new Notification(
        "This is notification title", {
            body: "This is notification body",
            icon: "images/icons/seo128x128.png",
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1,
            },
        });
}