const express = require('express'); // Correct, for example
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/Listing.js");//listing file ne require kari
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js") //use create route 
const ExpressError = require("./utils/ExpressError.js");
const { wrap } = require('module');
const { error } = require('console');
const { listingSchema } = require("./schema.js");
const  Review = require("./models/review.js");

app.use(express.json());

// Use the review routes




app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const MONGO_URl = "mongodb://127.0.0.1:27017/Wanderlust";

async function main() {
      try {
            await mongoose.connect(MONGO_URl);
            console.log("Connected to MongoDB.");
      } catch (err) {
            console.error("Failed to connect to MongoDB:", err);
      }
}
main()


app.get("/listing", wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index", { allListings });
}));

const validateListing = ((req, res, next) => {
      // let { error } = listingSchema.validate(req.body);
      if (error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, error);
      } else {
            next();
      }
});


//   New Route
app.get("/listing/new", wrapAsync(async (req, res) => { //new form mate new.ejs
      // let { id }
      res.render("listings/new.ejs");
}))

//Show Route //new route ne pela lakhiyu beacz ae pela new check kare pachi id per jay
app.get("/listing/:id", wrapAsync(async (req, res) => {
      let { id } = req.params;
      console.log(id)
      const listing = await Listing.findById(id);
      console.log(listing)
      res.render("listings/show.ejs", { listing })
}))


// Create Route  new lit crerat thay
app.post("/listing", validateListing, wrapAsync(async (req, res, next) => { //use wrapAsync remove try & catch
      //  let  result = listingSchema.validate(req.body);
      //  console.log(result);
      //  if(result.error){
      //       throw new ExpressError(400,result.error);
      //  }
      const newListing = new Listing(req.body.listing); //.listing thi data obje key : value pair ma ave not array       
      await newListing.save();
      res.redirect("./listing");
}))


//    Edit Route
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findByIdAndUpdate(id);
      console.log(listing)
      res.render("listings/edit.ejs", { listing });
}))

// Update ROUTE
app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
      // if (!req.body.listing) {
      //       throw new ExpressError(400, "Send Valid data")
      // } //not need directly validate thi add thay
      console.log("REQ RECEIVED")
      let { id } = req.params;

      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      res.redirect(`/listing/${id}`);
})
)

// DELETE ROUTE
app.delete("/listing/:id", wrapAsync(async (req, res) => {
      console.log("DELETED LISTING")
      let { id } = req.params;
      console.log(id)
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listing");

}))

//Reviwes post route
app.post("/listing/:id/reviews",async(req,res)=>{
      //review model ne reuire karvu uper
     let listing =  await Listing.findById(req.params.id)
     let newReview = new Review(req.body.review);
     console.log(newReview)

//   show.ejs ma form banauy aema review rating pass karva newReview ma store karyu
 

const router = express.Router();

router.post('/reviews', async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate the input
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).send({ error: 'Rating must be a number between 1 and 5' });
    }
    if (!comment || typeof comment !== 'string') {
      return res.status(400).send({ error: 'Comment is required and must be a string' });
    }

    // Create and save the new review
    const review = new Review({ rating, comment });
    await review.save();
    res.status(201).send(review);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
 
  listing.reviews.push(newReview); 
//   each listing jode review array hashe to ene push karvu newReview ander

  await newReview.save(); //save in both t db
  await listing.save();//beacu existing db ni document ma change karva use save function that is alo Async itself


  console.log("review saved");
  res.send("new review saved");
})

app.use((err, req, res, next) => {
      const { statusCode = 500, message = "Something went wrong" } = err;
      console.error(err); // Log the error to the console
      res.status(statusCode).render("listings/error.ejs", { message })
      // res.status(statusCode).send(message);
});

app.get("/", (req, res) => {

      res.send("Hi, i am root")
}
)




// app.get("/testListing",async(req,res)=>{
//       let sampleListing = new Listing({
//             title : "my vila",
//             description : "over the fly",
//             price : 12000,
//             location: "udaypur",
//             country : "India",
//       });
//       await sampleListing.save();
//       console.log("sample was saved");
//       res.send("successful testing");
// });

app.all("*", (req, res, next) => {
      next(new ExpressError(404, "Page Not Found"));//NOT 
})

app.use((err, req, res, next) => { //middleare thi handle the error to price valid enter 
      let { statusCode = 500, message = "something went wrong" } = err;//NOT 
      res.status(statusCode).send(message);
})
app.listen(8080, () => {
      console.log("server working")

})
