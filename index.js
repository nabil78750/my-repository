require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const User = require("./models/User");
const Offer = require("./models/Offer");
const app = express();
app.use(cors());
mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: "dxxgz9rpt",
  api_key: "698684197735757",
  api_secret: "wTeo75MJ-tcNRx0GLS3vhOyfhWU",
});

mongoose.connect("mongodb://localhost:27017/Vinted");
app.use(express.json());

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.all("*"),
  (req, res) => {
    res.statue(404).json({ message: "This route dose not exist" });
  };

app.listen(3000, () => {
  console.log("Server started");
});
