if(process.env.NODE_ENV != "production"){ //production ma nathi to use .env nai to biju
  require('dotenv').config()
}

console.log(process.env.SECRET) // remove this after you've confirmed it is working


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const MongoStore = require('connect-mongo');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const wrapAsync = require("./utils/wrapAsync.js");


const Listing = require("./models/Listing");
const listingRoutes = require('./routes/listing');

const Db_URL = process.env.ATLAS_DB_URL;



app.use('/listings', listingRoutes);

async function main() {
  await mongoose.connect(Db_URL);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });






app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl :  Db_URL,
  crypto: {  // prefered to use for encryption
      secret: process.env.SECRET,
  },
  touchAfter: 24* 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE",err);
});



const sessionOptions = {
      store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      Cookie: {
            expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
      },
};

app.use(passport.initialize());
app.use(session(sessionOptions))//user aek web na page & diffrent tab ma access kare password use kare nt need to login
app.use(flash());


// app.use(passport.initialize);
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport na ander badha user localstrategy thi authenticate hova joi 

passport.serializeUser(User.serializeUser());
// serialize users into the session all info store user into session
passport.deserializeUser(User.deserializeUser());
// user finsh work so deserialize the user


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;  //user ni info curr user store kare
  next();
});


// module.exports = router;

// Define your routes after this middleware
app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewsrouter);  //is require to create review
app.use("/",userRouter);

// Your other routes here...
// register mate
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "deltastudent1"
//   });
//   console.log("flesh")
  
//   let registerdUser = await User.register(fakeUser, "helloworld");
//   res.send(registerdUser);
// })


// Verify that you are setting the flash messages correctly in your routes
app.get("/listing", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// Example route that sets a flash message
app.post("/someRoute", (req, res) => {
  req.flash("success", "Successfully completed the action!");
  res.redirect("/listing");
});

// Middleware to set flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

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


// Searching FUnctionality
app.get("/listings/search/:searchValue", async (req, res, next) => {
  const searchTerm = req.params.searchValue; // This should retrieve the search term
  console.log("Search Term:", searchTerm); // Log to verify it's capturing the term
  
  const query = {
      $or: [
          { title: new RegExp(searchTerm, 'i') }, 
          { location: new RegExp(searchTerm, 'i') },
          { country: new RegExp(searchTerm, 'i') }, 
          { category: new RegExp(searchTerm, 'i') },
          { description: new RegExp(searchTerm, 'i') }
      ]
  };

  try {
      const allListings = await Listing.find(query);
      res.render("listings/index", { allListings, searchTerm }); // Ensure searchTerm is passed here
  } catch (error) {
      next(error);
  }
});

// Home route to show a simple search form

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