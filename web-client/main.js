const main = async () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }

  const permission = await window.Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }

  try {
    swRegistration = await navigator.serviceWorker.register("service.js");
  } catch (err) {
    console.log(err)
  }
};

