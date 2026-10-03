self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
  let title = "PA Control Center 🔔";
  let body = "You have a new reminder.";

  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      body = data.body || body;
    } catch (e) {
      console.log("Could not read push data:", e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: "pa-reminder"
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(list => {
      if (list.length > 0) {
        return list[0].focus();
      }

      return clients.openWindow("./");
    })
  );
});
