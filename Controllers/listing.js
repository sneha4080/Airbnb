const Listing = require("../models/Listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


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

module.exports.crateListingasync = async (req, res, next) => { //use wrapAsync remove try & catch
  let response =  await   geocodingClient.forwardGeocode({
        query: req.body.listing.location , //req.body na inside listing na inside location je nakhi ae male
        limit: 1  //budefault size 5 aave pan we set here
      })
        .send()
//    console.log(response.body.features[0].geometry) // coordinates: [ 72.579498, 23.02318 ] } male 
   
        
    const url = req.file.path;
    const filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    newListing.geometry =  response.body.features[0].geometry
   let savedListing =   await newListing.save();
   console.log(savedListing);
    req.flash("success", "New listing added...");
    res.redirect("/listing");
    console.log("added data");
    console.log(newListing);
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "listing  you requested for does't exists!"); //i want print this
        res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/w_200")
    res.render("listings/edit.ejs", { listing,originalImageUrl }); //je value change thi ae pan pass karvi

}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id); //find kae id cureuser ni sem to j edit kari shake nai to nai
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission edit listing");
        return res.redirect(`/listing/${id}`);
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file != "undefined") { //if any case img i want nt upadate img so error show thashe & fileN,price kai j update nai thay
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save();
    }
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
