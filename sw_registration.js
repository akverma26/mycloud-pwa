/* This file is just for registering service worker with our web app.
*/
const SERVICE_WORKER_PATH = './sw.js';

let serviceWorkerRegistration = null;

/* Register service worker as soon as page starts loading
*/
window.addEventListener("load", () => {
    registerServiceWorker();
});

/* Get service worker registration if it is already registered
*/
const getSWRegistration = () => {
    navigator.serviceWorker.getRegistration(SERVICE_WORKER_PATH)
        .then((sw_registration) => {
            serviceWorkerRegistration = sw_registration;
            document
                .querySelector(".register-service-worker .output").innerHTML = sw_registration?.active?.state;
        })
}

// Register the service worker
const registerServiceWorker = () => {
    navigator.serviceWorker.register(SERVICE_WORKER_PATH)
        .then((sw_registration) => {
            serviceWorkerRegistration = sw_registration;
            setTimeout(() => getSWRegistration(), 100);
        })
        .catch((err) => {
            console.log(err);
        });
}

// Unregister the service worker
const unRegisterServiceWorker = () => {
    if (serviceWorkerRegistration) {
        serviceWorkerRegistration.unregister().then((unregistered) => {
                getSWRegistration();
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

// This is just to show status of service worker registration on our
// main DOM, may be I'll remove these later
document
    .querySelector(".register-service-worker button#get-status")
    .addEventListener("click", (event) => {
        getSWRegistration();
    });

document
    .querySelector(".register-service-worker button#register")
    .addEventListener("click", (event) => {
        registerServiceWorker();
    });

document
    .querySelector(".register-service-worker button#unregister")
    .addEventListener("click", (event) => {
        unRegisterServiceWorker();
    });