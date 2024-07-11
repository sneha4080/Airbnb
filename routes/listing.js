const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js") //use create route 
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/Listing.js");//listing file ne require kari






const validateListing = ((req, res, next) => {
    console.log(req.body)
    const { error } = listingSchema.validate(req.body);
    if (error) {
          let errMsg = error.details.map((el) => el.message).join(",");
          throw new ExpressError(400, errMsg);
    } else {
          next();
    }
});




// index Route
router.get("/listing",wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
})
);    

//   New Route
router.get("/listing/new", wrapAsync(async (req, res) => { //new form mate new.ejs
      await Listing.findByIdAndUpdate();
      res.render("listings/new.ejs");
}))

//Show Route //new route ne pela lakhiyu beacz ae pela new check kare pachi id per jay
router.get("/listing/:id", wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate();

      const listing = await Listing.findById(id).populate("reviews");

      res.render("listings/show.ejs", { listing })
}))


// Create Route  new lit crerat thay

router.post("/listing", validateListing, wrapAsync(async (req, res, next) => { //use wrapAsync remove try & catch
      let result = listingSchema.validate(req.body);
      await Listing.findByIdAndUpdate();
      await Listing.findByIdAndUpdate();
      console.log(result);
      //  if(result.error){
      //       throw new ExpressError(400,result.error);
      //  }
      const newListing = new Listing(req.body.listing); //.listing thi data obje key : value pair ma ave not array       
      await newListing.save();
      res.redirect("./listing");
}))


//    Edit Route
router.get("/listing/:id/edit", wrapAsync(async (req, res) => {
      let { id } = req.params;
      // await Listing.findByIdAndUpdate();
      const listing = await Listing.findById(id);
      console.log(id);
      res.render("listings/edit.ejs");
    
}))

// Update ROUTE
router.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
      // if (!req.body.listing) {
      await Listing.findByIdAndUpdate();
      //       throw new ExpressError(400, "Send Valid data")
      // } //not need directly validate thi add thay
      console.log("REQ RECEIVED")
      let { id } = req.params;

      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      res.redirect(`/listing/${id}`);
})
)

// DELETE ROUTE
router.delete("/listings/:id/reviews", wrapAsync(async (req, res) => {
      console.log("DELETED LISTING")
      await Listing.findByIdAndUpdate();
      let { id } = req.params;
      console.log(id)
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listing");
}))

module.exports = router;