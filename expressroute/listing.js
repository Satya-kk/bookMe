const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(validateListing, isLoggedIn, upload.single("listing[image]"),wrapAsync(listingController.createListing));
    

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/search", listingController.searchQuery);

router.route("/:id")
    .put(validateListing,isOwner,upload.single("listing[image]"), wrapAsync(listingController.saveListing))
    .get(wrapAsync(listingController.showListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

router.get("/category/:category", listingController.categoryListing);



module.exports = router;


