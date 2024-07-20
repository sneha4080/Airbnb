const Listing = require("../models/Listing.js")
const { listingSchema } = require("../schema.js");


module.exports.index = (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})

module.exports.renderNewFrom = (req, res) => { //new form mate new.ejs
    res.render("listings/new.ejs");
}

module.exports.showListinng = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");//method thi owner info print thay
    if (!listing) {
        req.flash("error", "Listing   does't exists!");//always print this
        res.redirect("/listing");
    }
    console.log(listing); //listing ni badhi info print thay

    res.render("listings/show.ejs", { listing })
}

module.exports.crateListingasync = async(req, res, next) => { //use wrapAsync remove try & catch
    let result = listingSchema.validate(req.body);
    const newListing = new Listing(req.body.listing); //.listing thi data obje key : value pair ma ave not array       
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listing");
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
          req.flash("error", "listing  you requested for does't exists!"); //i want print this
          res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing });

}

module.exports.updateListing = async (req, res) => {
    console.log(req.body);
    // if (!req.body.listing) {
    //       throw new ExpressErsror(400, "Send Valid data")
    // } //not need directly validate thi add thay
    let { id } = req.params;
    let listing = await Listing.findById(id); //find kae id cureuser ni sem to j edit kari shake nai to nai
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
          req.flash("error", "You don't have permission edit listing");
          return res.redirect(`/listing/${id}`);
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated!");
    res.redirect(`/listing/${id}`);

}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted!");
    res.redirect("/listing");
}
