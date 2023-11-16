const mongoose = require("mongoose");

const Fitre = mongoose.model("Filtre", {
  title: String,
  priceMin: Number,
  priceMax: Number,
  sort: String,
  page: Number,
});

module.exports = Fitre;
