const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js") //use create route 
const Listing = require("../models/Listing.js");//listing file ne require kari
const Review = require("../models/review.js")
const { listingSchema } = require("../schema.js"); ///for schema
const { validateReview, isLoggedIn, isReviewAuthor, validateListing } = require("../middleware.js")

const reviewController = require("../Controllers/review.js")


//Reviwes post route
router.post("/",
      isLoggedIn, //protect backend koi bhi hopschose thi pan review add na kare loggedIn thavu pade
      validateReview,
      wrapAsync(reviewController.createReview)
);




// delete Review Route
router.delete("/:reviewId",
      isLoggedIn,
      isReviewAuthor,
      wrapAsync(reviewController.destroyReview)
);
//here you using app.post and appp is not defind here and second thing in delete route you used req.redirect in place of  res.redirect 
// when review not delte that error
module.exports = router;