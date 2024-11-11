
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // Use create route 
const Listing = require("../models/Listing.js"); // Listing file require
const { isLoggedIn, isOwner, validateReview, validateListing } = require("../middleware.js");
const flash = require('connect-flash');
const listingController = require("../Controllers/listing.js");
const multer = require('multer');
const { storage } = require("../ClouConfig.js");
const upload = multer({ storage });

// Route for listing index and create
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.crateListingasync));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewFrom);

// Show, Update and Delete Route
router.route("/:id")
  .get(wrapAsync(listingController.showListinng))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// Delete review route (assuming you want to delete reviews separately)
router.delete("/:id/reviews", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.delete('/all', async (req, res) => {
  try {
    await Listing.deleteMany({});
    res.redirect('/listings');
  } catch (err) {
    console.log(err);
    res.redirect('/listings');
  }
});

module.exports = router;
// the error was because of wrong route listing and listings
// app.use listings = listing //here