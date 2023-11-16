const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");
const cloudinary = require("cloudinary").v2;

const Offer = require("../models/Offer");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      // console.log(req.files);
      // console.log(req.body);

      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      // const userFound = await User.findOne({ email: email });

      // console.log(userFound);

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ÉTAT: condition,
          },
          {
            COULEUR: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        owner: req.user,
      });
      console.log("newOffer =>", newOffer);

      if (req.files) {
        const convertedPicture = convertToBase64(req.files.picture);
        const result = await cloudinary.uploader.upload(
          convertedPicture, //option pour créé un dossier sur cloudinary.
          {
            folder: `/vinted/offers/${newOffer._id}`,
          }
        );
        // inclure l'image dans notre nouveau document (donc l'offre)
        newOffer.product_image = result;
      }
      console.log(newOffer);

      await newOffer.save();

      res.status(201).json(newOffer);
    } catch (error) {
      res.status(400).json({ message: message.error });
    }
  }
);
module.exports = router;
