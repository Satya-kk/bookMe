const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn,isCreatedBy } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

// CREATE REVIEW
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE REVIEW
router.delete("/:reviewId",isLoggedIn,isCreatedBy, wrapAsync(reviewController.deleteReview));

module.exports = router;
