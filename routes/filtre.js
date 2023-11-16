const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const Offer = require("../models/Offer");

router.post("/user/signup", async (req, res) => {
  try {
    const filter = {};
  } catch (error) {
    res.status(500).json({ message: message.error });
  }
});
