/* DAVIN Firebase Cloud Messaging Service Worker.
   Keep this file in the same published folder as index.html. */
importScripts("https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCyXx7ynIiMtIncmNG_CmB3_J6pOEYzMPk",
  authDomain: "mero-2e39b.firebaseapp.com",
  projectId: "mero-2e39b",
  storageBucket: "mero-2e39b.firebasestorage.app",
  messagingSenderId: "30733503616",
  appId: "1:30733503616:web:e7e02032c200d347802a65"
});

const messaging = firebase.messaging();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

messaging.onBackgroundMessage(payload => {
  const data = payload && payload.data ? payload.data : {};
  const title = data.title || "DAVIN ♡";
  const options = {
    body: data.body || "وصلتك رسالة جديدة 💌",
    icon: new URL("./icon-192.png", self.location.href).href,
    badge: new URL("./icon-192.png", self.location.href).href,
    tag: data.tag || "davin-message",
    renotify: false,
    data: { url: data.url || "./" }
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const scopeUrl = new URL("./", self.location.href);
  const rawTarget = event.notification.data && event.notification.data.url || "./";
  let target = scopeUrl.href;
  try {
    const candidate = new URL(rawTarget, self.location.href);
    if (candidate.origin === scopeUrl.origin && candidate.pathname.startsWith(scopeUrl.pathname)) {
      target = candidate.href;
    }
  } catch (_) {}
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientsList) {
      try {
        const clientUrl = new URL(client.url);
        if (clientUrl.origin === scopeUrl.origin && clientUrl.pathname.startsWith(scopeUrl.pathname)) {
          await client.focus();
          if ("navigate" in client && client.url !== target) await client.navigate(target);
          return;
        }
      } catch (_) {}
    }
    await self.clients.openWindow(target);
  })());
});
