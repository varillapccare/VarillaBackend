const express = require("express");
require("dotenv/config");
const cors = require("cors");
const mongoose = require("mongoose");
const { User } = require("./models/user");
const { Phone } = require("./models/phone");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "varilaDB",
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const generateRandomKey = (length) => {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

app.get("/", (req, res) => {
  res.send("App is working fine");
});

app.get("/phone", async (req, res) => {
  const phone = await Phone.find();

  if (!phone) return res.send("Error");

  return res.send(phone);
});

app.post("/phone", async (req, res) => {
  const phone = new Phone({
    phone: req.body.phone,
  });

  const phoneSaved = await phone.save();

  if (!phoneSaved) {
    return res.status(400).send("Phone can't be saved !");
  }

  res.status(200).send(phoneSaved);
});

app.put("/phone", async (req, res) => {
  const phone = await Phone.findByIdAndUpdate(
    req.body.phoneid,
    {
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!phone) {
    return res.status(400).send("Phone can't be updated !");
  }

  res.status(200).send(phone);
});

app.get("/users", async (req, res) => {
  let filter = {};
  if (req.query.activationKey) {
    filter = { activationKey: req.query.activationKey };
  }
  const users = await User.find(filter);

  if (!users) {
    return res.status(400).send("Cannot fetch users");
  }

  res.status(200).send(users);
});

app.post("/users", async (req, res) => {
  const user = new User({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    phoneNumber2: req.body.phoneNumber2,
    address: req.body.address,
    zipcode: req.body.zipcode,
    activationKey: generateRandomKey(5),
    validTill: req.body.validTill,
    registerDate: new Date(),
    validFrom: req.body.validFrom,
    cards: req.body.cards,
  });

  const userSaved = await user.save();

  if (!userSaved) {
    return res.status(400).send("User can't be saved !");
  }

  res.status(200).send(user);
});

app.put("/users", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.body.userid,
    {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      phoneNumber2: req.body.phoneNumber2,
      address: req.body.address,
      zipcode: req.body.zipcode,
      validTill: req.body.validTill,
      validFrom: req.body.validFrom,
      cards: req.body.cards,
    },
    { new: true }
  );

  if (!user) {
    return res.status(400).send("User can't be updated !");
  }

  res.status(200).send(user);
});

app.delete("/users", async (req, res) => {
  const userDeleted = await User.findByIdAndDelete(req.body.userid);

  if (!userDeleted) {
    return res.status(400).send("User can't be deleted !");
  }

  res.status(200).send(userDeleted);
});

app.listen(process.env.PORT, () => {
  console.log(`App is listening`);
});
