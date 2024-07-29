const express = require('express'); // Correct, for example
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/Listing.js");//listing file ne require kari
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js") //use create route 
const ExpressError = require("./utils/ExpressError.js");// use nai thatu
const reviews = require("./models/review.js")
const listings = require("./routes/listing.js")
const reviewroute = require("./routes/review.js")
const { wrap } = require('module');
const { error } = require('console');
const { listingSchema, reviewSchema } = require("./schema.js");
// console.log(listingSchema); // This should log the schema definition
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./models/user.js");


app.use(express.json());



const sessionOptions = {
      secret: "mysupercode",
      resave: false,
      saveUninitialized: true,
      Cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
      },
};
app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize);
app.use(passport.session);
passport.use(new Localstrategy(User.authenticate));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", (req, res) => {
      res.send("Hi, i am root")
}
)

// Use the review routes




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

// Middleware to set flash messages
app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      next();
});

// hendle error in webpage

    

  
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get('/listing', (req, res) => {
      // Assuming error is a message or an array of messages
      const error = req.session.error || [];
      res.render('/listing', { error: error });
});
// register mate
// app.get("/demouser", async (req, res) => {
//       let fakeUser = new User({
//             email: "student@gmail.com",
//             username: "deltastudent"
//       });
//       console.log("flesh")
                                       //staticmethod             password pass karyo
//       let registerdUser = await User.register    (fakeUser, "helloworld");
//       res.send(registerdUser);
// })


app.use("/listing", listingRouter)
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/listing", wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index", { allListings });
}));


app.use((err, req, res, next) => {
      const { statusCode = 500, message = "Something went wrong" } = err;
      console.error(err); // Log the error to the console
      res.status(statusCode).render("listings/error.ejs", { message })
      res.status(statusCode).send(message);
})



app.all("*", (req, res, next) => {
      next(new ExpressError(400, "page not found"));
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

app.use((err, req, res, next) => { //middleare thi handle the error to price valid enter 
      let { statusCode = 500, message = "something went wrong" } = err;//NOT 
      res.status(statusCode).send(message);
})
app.listen(8080, () => {
      console.log("server working")

})
