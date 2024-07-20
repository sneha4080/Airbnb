
const Listing = require("../models/Listing");
const Review = require ("../models/review");
const flash = require('connect-flash');


module.exports.createReview = async (req, res) => {
    //review model ne reuire karvu uper
    let listing = await Listing.findById(req.params.id)
    console.log(listing)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; //new review no authore store thay
    console.log(newReview)
    //   show.ejs ma form banauy aema review rating pass karva newReview ma store karyu
    listing.reviews.push(newReview);
    //   each listing jode review array hashe to ene push karvu newReview ander
    await newReview.save(); //save in both t db
    await listing.save();//beacu existing db ni document ma change karva use save function that is alo Async itself
    req.flash("success", "New review created!");
    res.redirect(`/listing/${listing._id}`);
    // res.render('show', { item: item });
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//areviewId ni array  inside delete the review use findByIdUpdate kari revi ni id ne delete karvi pade so use MONGOSH $PULL OPERATER
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " New review deleted!");
    res.redirect(`/listing/${id}`);
};
