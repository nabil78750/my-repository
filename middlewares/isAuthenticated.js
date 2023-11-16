const User = require("../models/User");

const { urlencoded } = require("express");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    // console.log(req.headers.authorization)
    //récupérer le token envoyé dans req.headers.authorization
    const userToken = req.headers.authorization.replace("Bearer ", "");
    // console.log(userToken);
    // recupérer le owner de l'offr grâce au token
    const user = await User.findOne({ token: userToken }).select("account");
    console.log("user=>", user);

    if (!user) {
      return res.status(401).json("Unauthorized");
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json("Unauthorized");
  }
};

module.exports = isAuthenticated;
