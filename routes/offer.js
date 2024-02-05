const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");
const cloudinary = require("cloudinary").v2;
const Offer = require("../models/Offer");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.get("/offers", async (req, res) => {
  try {
    const limit = 5;
    let skip = 0;
    if (req.query.sort) {
      if (req.query.sort !== "price-asc" && req.query.sort !== "price-desc") {
        return res.status(400).json({ message: "Invalid sort query" });
      }
    }

    // console.log(req.query); // { title: 'pantalon', priceMax: '40', priceMin: '20' }
    const filters = {};
    // si j'ai une query title, alors dans mon objet filters je rajoute une clef product_name, et je lui assigne la valeur récupérée en query :
    if (req.query.title) {
      filters.product_name = new RegExp(req.query.title, "i");
    }
    if (req.query.priceMin) {
      filters.product_price = { $gt: req.query.priceMin };
    }

    if (req.query.priceMax) {
      // a ce stade , si on a pas de query priceMin, alors l'objet filters.product_price, N'EXISTE PAS
      // par conséquent, impossible de créer une clef dedans !
      if (filters.product_price) {
        filters.product_price.$lt = req.query.priceMax;
      } else {
        filters.product_price = { $lt: req.query.priceMax };
      }
    }
    // on applique le même principe pour le sort :
    const sortedObject = {};
    if (req.query.sort) {
      const purifiedSortQuery = req.query.sort.replace("price-", "");
      sortedObject.product_price = purifiedSortQuery;
    }

    if (req.query.page) {
      skip = (req.query.page - 1) * limit;
    }
    const offers = await Offer.find(filters)
      .select("product_name  product_price -_id")
      .sort(sortedObject)
      .limit(limit)
      .skip(skip);
    return res.status(200).json(offers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    console.log(req.params);
    const offer = await Offer.findById(req.params.id).populate({
      select: "account",
      path: "owner",
    });
    if (offer) {
      return res.status(200).json(offer);
    } else {
      return res
        .status(400)
        .json({ message: "Aucune offre ne correspond à cet ID" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

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
      // créer le document correspondant à l'offre//
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
