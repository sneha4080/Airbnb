const mongoose = require("mongoose");
// const review = require("./review.js");
const Schema = mongoose.Schema;
const Review = require("./review.js");
// const { reviewSchema } = require("../schema.js");
const { string, types, required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String
  },

  price: Number,
  location: String,
  country: String,
  reviews: [ //create one arrya and indivudual store one objId of reviews 
    {
      type: Schema.Types.ObjectId,
      ref: "Review" // Review model ref bane
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,    ref: "User",
  },
  geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      // required: true
    },

    coordinates: {
      type: [Number],
      required: true
    }
  }
 

}

  

);

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } }) //delete review je db na ander listing na review na array ma aave
  }
})

listingSchema.get('/search', async (req, res) => {
  const searchQuery = req.query.country || ''; 
  const listings = await Listing.find({ country: new RegExp(searchQuery, 'i') }); // Case-insensitive search
  res.json(listings); // Return matching listings
});



// function searchListings() {
//   const query = document.getElementById('searchBar').value;
//   fetch(`/search?country=${query}`)
//       .then(response => response.json())
//       .then(data => {
//           // Render listings dynamically based on the results
//       });
// }

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 
