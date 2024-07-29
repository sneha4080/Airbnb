const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js") //use create route 
const Listing = require("../models/Listing.js");//listing file ne require kari
const { isLoggedIn, isOwner, listingSchema, validateReview } = require("../middleware.js")
const flash = require('connect-flash');


const { validateListing } = require("../middleware.js")

const listingController = require("../Controllers/listing.js")
<<<<<<< HEAD
=======
const multer = require('multer')
const { storage } = require("../ClouConfig.js");
const upload = multer({ storage })
>>>>>>> 4e574e3 (Create branch)



// both req Ggo to root(/) so use Router.route method & combine the index &  create route
router
      .route("/")
      .get(wrapAsync(listingController.index))
      .post(isLoggedIn,
            upload.single('listing[image]'),
            validateListing,
            wrapAsync(listingController.crateListingasync)
      );

<<<<<<< HEAD
// both req Ggo to root(/) so use Router.route method & combine the index &  create route
router
      .route("/")
      .get(wrapAsync(listingController.index))
      .post(isLoggedIn,
            validateListing,
            wrapAsync(listingController.crateListingasync)
      );

=======
// .post(upload.single('listing[image]'), (req, res) => {
//       res.send(req.file)
// })
>>>>>>> 4e574e3 (Create branch)

//   New Route
router.get("/new", isLoggedIn, listingController.renderNewFrom);


router.route("/:id")
<<<<<<< HEAD
.get( wrapAsync(listingController.showListinng))
.put(
      isLoggedIn,
      isOwner,
      validateListing, wrapAsync(listingController.updateListing)
)
.delete(
      isLoggedIn, //first check condition logedIn then check kare owner che ke nai
      isOwner,
      wrapAsync(listingController.deleteListing)
);
=======
      .get(wrapAsync(listingController.showListinng))
      .put(
            isLoggedIn,
            isOwner,
            upload.single('listing[image]'),
            validateListing, wrapAsync(listingController.updateListing)
      )
      .delete(
            isLoggedIn, //first check condition logedIn then check kare owner che ke nai
            isOwner,
            wrapAsync(listingController.deleteListing)
      );
>>>>>>> 4e574e3 (Create branch)



//Show Route //new route ne pela lakhiyu beacz ae pela new check kare pachi id per jay
// router.get("/:id", wrapAsync(listingController.showListinng)
// );


//    Edit Route
router.get("/:id/edit",
      isLoggedIn,
      isOwner,
      wrapAsync(listingController.editListing)
)

<<<<<<< HEAD
// // UPDATE ROUTE
// router.put("/:id",
//       isLoggedIn,
//       isOwner,
//       validateListing, wrapAsync(listingController.updateListing)
// );
=======
>>>>>>> 4e574e3 (Create branch)

// DELETE ROUTE
router.delete("/:id/reviews",
      isLoggedIn, //first check condition logedIn then check kare owner che ke nai
      isOwner,
      wrapAsync(listingController.deleteListing)
);
module.exports = router;



// the error was because of wrong route listing and listings
// app.use listings = listing //here
<<<<<<< HEAD
// yes and in delete too there was listings
=======
// yes and in delete too there was listings
>>>>>>> 4e574e3 (Create branch)
