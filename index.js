require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const Offer = require("./models/Offer");
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_PUBLIC_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur l'API Vinted !");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.all("*"),
  (req, res) => {
    res.statue(404).json({ message: "This route dose not exist" });
  };

console.log("Coucou tout le monde ! 👋👋👋👋👋");

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
