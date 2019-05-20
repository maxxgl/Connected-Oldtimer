const vapidPublicKey = "BC6wmpM0ALY7lJC_tozKRJd7NRt4wh-0wxHoLn4kPdiNdb4oUC-XyynnbTQ1gMIMyzmX33ZdOVbU3nxOSFMvPD0"

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async subscription => {
  const SERVER_URL = "http://localhost:4000/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscription)
  });
  return response.json();
};

self.addEventListener("activate", async () => {
  const mgr = self.registration.pushManager
  let subscription = await mgr.getSubscription()
  if (!subscription) {
    const applicationServerKey = urlB64ToUint8Array(vapidPublicKey);
    const options = { applicationServerKey, userVisibleOnly: true }
    try {
      let newSubscription = await mgr.subscribe(options);
      const response = await saveSubscription(newSubscription);
      console.log(response)
    } catch (err) {
      console.log("Subscription Error", err);
    }
  }
});

self.addEventListener("push", function(event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
    showLocalNotification("Yolo", event.data.text(),  self.registration);
  } else {
    console.log("Push event but no data");
  }
});

const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body,
  };
  swRegistration.showNotification(title, options);
};
