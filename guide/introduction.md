# PWA

PWAs are web apps developed using a number of specific technologies and standard patterns to allow them to take advantage of both web and native app features. For example, web apps are more discoverable than native apps; it's a lot easier and faster to visit a website than to install an application, and you can also share web apps by sending a link.

On the other hand, native apps are better integrated with the operating system and therefore offer a more seamless experience for the users. You can install a native app so that it works offline, and users love tapping their icons to easily access their favorite apps, rather than navigating to it using a browser.

PWAs give us the ability to create web apps that can enjoy these same advantages.

**References:**

https://web.dev/what-are-pwas/

https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Introduction

# Creating a *Simple* PWA

> Complete Guide: https://web.dev/learn/pwa/

1. Create a usual website.

2. Add Web App Manifest

   > intro: https://web.dev/add-manifest/
   > intro: https://developer.mozilla.org/en-US/docs/Web/Manifest

   1. Create a `json` file. ex: `manifest.json` (you can name it anything)

      > ref: https://web.dev/add-manifest/#create
      > ref: https://developer.mozilla.org/en-US/docs/Web/Manifest
      > ref: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs#the_manifest_file

   2. And then link this manifest file to your root html file.

      ```html
      <link rel="manifest" href="manifest.json"/>
      ```

3. At last add a service worker

   > intro: https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#what_is_a_service_worker
   > intro: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers#service_workers_explained

   1. Create a javascript file. ex: `sw.js` (again you can name it anything)

      > What a service worker can do: https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#what_can_service_workers_do
      > ref: https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope
      > ref: https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#service_worker_events
      > ref: https://web.dev/learn/pwa/service-workers/
      > ref: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers#registering_the_service_worker

   2. Register this service worker with your website (in your website javascript)

      ```javascript
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
        navigator.serviceWorker
         .register("/sw.js")
         .then(res => console.log("Service worker registered"))
         .catch(err => console.log("Service worker not registered", err))
        })
      }
      ```

      