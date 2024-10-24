require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8002;
const mongoose = require("mongoose");
const path = require("path");
const { startSubscriber } = require("./controller/subscriber");
// const { MONGODB_URI } = require("./config/keys");

startSubscriber()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected 🥭");
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`CRUD module listening on port ${port} 🌐`);
});