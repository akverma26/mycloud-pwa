const SERVICE_WORKER_PATH = "./scripts/service_worker/service_worker.js";
let serviceWorkerRegistration = null;

window.addEventListener("load", () => {
    registerServiceWorker();
});

navigator.serviceWorker.addEventListener('statechange', (e) => {
    document
        .querySelector(".register-service-worker .state").innerHTML = e.target.state;
});

const getSWRegistration = () => {
    navigator.serviceWorker.getRegistration(SERVICE_WORKER_PATH)
        .then((sw_registration) => {
            serviceWorkerRegistration = sw_registration;
            document
                .querySelector(".register-service-worker .output").innerHTML = sw_registration?.active?.state;
        })
}

const registerServiceWorker = () => {
    navigator.serviceWorker.register(SERVICE_WORKER_PATH, {scope: "./scripts/service_worker/"})
        .then((sw_registration) => {
            serviceWorkerRegistration = sw_registration;
            setTimeout(()=>getSWRegistration(), 100);
        })
        .catch((err) => {
            console.log(err);
        });
}

const unRegisterServiceWorker = () => {
    if(serviceWorkerRegistration){
        serviceWorkerRegistration.unregister().then((unregistered) => {
            getSWRegistration();
        })
        .catch((err) => {
            console.log(err);
        });
    }
}

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