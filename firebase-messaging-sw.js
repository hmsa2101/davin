/* DAVIN FCM background worker. Does not cache private conversations or authentication data. */
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
messaging.onBackgroundMessage(payload => {
  const data = payload && payload.data ? payload.data : {};
  const title = data.title || "DAVIN ♡";
  const options = {
    body: data.body || "وصلتك رسالة جديدة 💌",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: data.tag || "davin-message",
    renotify: false,
    data: { url: data.url || "./" }
  };
  return self.registration.showNotification(title, options);
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "./", self.location.origin).href;
  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientsList) {
      if (new URL(client.url).origin === self.location.origin) {
        await client.focus();
        if ("navigate" in client) await client.navigate(target);
        return;
      }
    }
    await clients.openWindow(target);
  })());
});
