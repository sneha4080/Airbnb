const express = require('express'); // Correct, for example
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/Listing.js");//listing file ne require kari
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const WrapAsync = require("./utils/wrapAsync.js"); //use create route 
const ExpressError = require("./utils/ExpressError.js");




app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const MONGO_URl = "mongodb://127.0.0.1:27017/Wanderlust";

main()
      .then(() => {
            console.log("connected to DB");
      }).catch((err) => {
            console.log(err);
      })



async function main() {
      await mongoose.connect(MONGO_URl);
}
app.get("/", (req, res) => {

      res.send("Hi, i am root")
}
)
// Index Route
app.get("/listing", WrapAsync,async (req, res) => { //s
      const allListings = await Listing.find({});//uper model/listing require karyu to tayathi data aave
      res.render("listings/index.ejs", { allListings });
})

//   New Route
app.get("/listing/new", (req, res) => { //new form mate new.ejs
      res.render("listings/new.ejs");
})
//Show Route //new route ne pela lakhiyu beacz ae pela new check kare pachi id per jay
app.get("/listing/:id",WrapAsync, async (req, res) => {
      let { id } = req.params; 
      console.log(id)
      const listing = await Listing.findById(id);
      console.log(listing)
      res.render("listings/show.ejs", { listing })
})
// problrm in brouwser


// Create Route  new lit crerat thay
app.post("/listing",WrapAsync, async (req, res, next) => { //use wrapAsync remove try & catch
        if(!req.body.listing){
            throw new ExpressError(400,"Send Valid data")
        }
            const newListing = new Listing(req.body.listing); //.listing thi data obje key : value pair ma ave not array 
            // console.log(listing);
            await newListing.save();
            res.redirect("/listing");
      
})

//    Edit Route
app.get("/listing/:id/edit",WrapAsync, async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findByIdAndUpdate(id);
      console.log(listing)
      res.render("listing/edit.js", { listing });   //edit route me edit ka logic likhna baki hai bro ? i write that logic . par yaha par to hai hi nhi ?
})

// Update ROUTE
app.put("/listing/:id",WrapAsync, async (req, res) => {
      if(!req.body.listing){
            throw new ExpressError(400,"Send Valid data")
        }
      console.log("REQ RECEIVED")
      let { id } = req.params;

      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      res.redirect(`/listing/${id}`);
})


// DELETE ROUTE
app.delete("/listing/:id", WrapAsync,async (req, res) => {
      console.log("DELETED LISTING")
      let { id } = req.params;
      console.log(id)
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listing");

})




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

app.all("*",(req,res,next)=>{
      next(new ExpressError(404,"Page Not Found"));//NOT 
})
 app.use((err, req, res, next) => { //middleare thi handle the error to price valid enter 
      let {statusCode=500,message="something went wrong"} = err;//NOT 
      res.status(statusCode).send(message);
})
app.listen(8080, () => {
      console.log("server working")

})
// ok problem is when i click the any of btn and submit data shoe the eeror

