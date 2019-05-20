const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require('web-push')

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 4000;
const dummyDb = { subscription: null }; //dummy in-memory store

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/save-subscription", async (req, res) => {
  const subscription = req.body;
  await saveToDatabase(subscription); //Method to save the subscription to Database
  res.json({ message: "success" });
});

app.post('/send', (req, res) => {
  const subscription = dummyDb.subscription //get subscription from your databse here.
  const { message = '' } = req.body

  webpush.sendNotification(subscription, message)
    .then(() => res.json({ message: 'message sent' }))
    .catch(err => {
      console.log(err)
      res.json({ message: 'message failed to send' })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


const saveToDatabase = async subscription => {
  dummyDb.subscription = subscription;
};

webpush.setVapidDetails(
  'mailto:myuserid@email.com',
  "BC6wmpM0ALY7lJC_tozKRJd7NRt4wh-0wxHoLn4kPdiNdb4oUC-XyynnbTQ1gMIMyzmX33ZdOVbU3nxOSFMvPD0",
  process.env.VAPID_PRIVATE,
)
