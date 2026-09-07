



// if(process.env.NODE_ENV != "production"){ //production ma nathi to use .env nai to biju
//   require('dotenv').config()
// }

// // console.log(process.env.SECRET) // remove this after you've confirmed it is working


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");

// const MongoStore = require('connect-mongo');
// const session = require("express-session");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");

// const listingsRouter = require("./routes/listing.js");
// const reviewsrouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");

// const wrapAsync = require("./utils/wrapAsync.js");


// const Listing = require("./models/Listing");
// const listingRoutes = require('./routes/listing');
// const { date } = require('joi');

// const Db_URL = process.env.ATLAS_DB_URL;



// app.use('/listings', listingRoutes);

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(Db_URL);
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));


// const Store =  MongoStore.create({
//   mongoUrl:  Db_URL,
//   crypto: {
//     secret: process.env.SECRET, 
//   },
//   touchAfter: 24 * 3600 
// })
// Store.on("error",()=>{
//   console.log("Error IN  MongoDb Sessions ",err)
// })

// const sessionOptions = {
//     Store,
//       secret: process.env.SECRET,
//       resave: false,
//       saveUninitialized: true,
//       Cookie: {
//             expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//             httpOnly: true
//       },
// };

// app.use(passport.initialize());
// app.use(session(sessionOptions))//user aek web na page & diffrent tab ma access kare password use kare nt need to login
// app.use(flash());


// // app.use(passport.initialize);
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// // passport na ander badha user localstrategy thi authenticate hova joi 

// passport.serializeUser(User.serializeUser());
// // serialize users into the session all info store user into session
// passport.deserializeUser(User.deserializeUser());
// // user finsh work so deserialize the user


// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;  //user ni info curr user store kare
//   next();
// });


// // module.exports = router;

// // Define your routes after this middleware
// app.use("/listing", listingsRouter);
// app.use("/listing/:id/reviews", reviewsrouter);  //is require to create review
// app.use("/",userRouter);


// // Verify that you are setting the flash messages correctly in your routes
// app.get("/listing", wrapAsync(async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index", { allListings });
// }));





// app.get("/listings/search/:searchValue", async (req, res, next) => {
//   const searchTerm = req.params.searchValue; // Retrieve the search term
//   console.log("Search Term:", searchTerm); // Log the search term for debugging

//   const query = {
//     $or: [
//       { title: new RegExp(searchTerm, 'i') },
//       { location: new RegExp(searchTerm, 'i') },
//       { country: new RegExp(searchTerm, 'i') },
//       { category: new RegExp(searchTerm, 'i') },
//       { description: new RegExp(searchTerm, 'i') },
//     ],
//   };

//   console.log("Generated Query:", JSON.stringify(query, null, 2)); // Log the query for debugging

//   try {
//     // Fetch matching listings
//     const results = await Listing.find(query);
//     console.log("Search Results:", results); // Log the results

//     // Render the results
//     res.render("listings/index", { allListings: results, searchTerm });
//   } catch (error) {
//     console.error("Error during search:", error); // Log errors
//     next(error);
//   }
// });





// // Home route to show a simple search form
// app.get("/", (req, res) => {
//     res.redirect("/listings");
// });
// app.all("*", (req, res, next) => {
//       next(new ExpressError(404, "Page Not Found"));//NOT 
// })

// app.use((err, req, res, next) => { //middleare thi handle the error to price valid enter 
//   let { statusCode = 500, message = "something went wrong" } = err;//NOT 
//   res.status(statusCode).send(message);
// })
// app.listen(3003, () => {
//   console.log("server working 3003")
//   console.log("http://localhost:3003")

// })







// 2222

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const wrapAsync = require("./utils/wrapAsync.js");
const Listing = require("./models/Listing.js");

const DB_URL = process.env.ATLAS_DB_URL;


// ================= DATABASE =================

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(DB_URL);
}


// ================= EXPRESS CONFIG =================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));


// ================= SESSION STORE =================

const Store = MongoStore.create({
    mongoUrl: DB_URL,

    crypto: {
        secret: process.env.SECRET,
    },

    touchAfter: 24 * 3600,
});

Store.on("error", (err) => {
    console.log("Error in MongoDB Sessions:", err);
});


// ================= SESSION =================

const sessionOptions = {
    store: Store,

    secret: process.env.SECRET,

    resave: false,

    saveUninitialized: true,

    cookie: {
        expires: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),

        maxAge: 7 * 24 * 60 * 60 * 1000,

        httpOnly: true,
    },
};


// ================= SESSION + FLASH + PASSPORT =================

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());

app.use(passport.session());


// ================= PASSPORT =================

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());


// ================= GLOBAL VARIABLES =================

app.use((req, res, next) => {

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    res.locals.currUser = req.user;

    next();
});


// ================= ROUTES =================

// Listing routes
app.use("/listing", listingsRouter);

// Review routes
app.use("/listing/:id/reviews", reviewsRouter);

// User routes
app.use("/", userRouter);


// ================= ALL LISTINGS =================

app.get(
    "/listing",
    wrapAsync(async (req, res) => {

        const allListings = await Listing.find({});

        res.render("listings/index", {
            allListings,
        });
    })
);


// ================= SEARCH =================

app.get(
    "/listings/search/:searchValue",
    async (req, res, next) => {

        const searchTerm = req.params.searchValue;

        console.log("Search Term:", searchTerm);

        const query = {
            $or: [
                {
                    title: new RegExp(searchTerm, "i"),
                },
                {
                    location: new RegExp(searchTerm, "i"),
                },
                {
                    country: new RegExp(searchTerm, "i"),
                },
                {
                    category: new RegExp(searchTerm, "i"),
                },
                {
                    description: new RegExp(searchTerm, "i"),
                },
            ],
        };

        console.log(
            "Generated Query:",
            JSON.stringify(query, null, 2)
        );

        try {

            const results = await Listing.find(query);

            console.log("Search Results:", results);

            res.render("listings/index", {
                allListings: results,
                searchTerm,
            });

        } catch (error) {

            console.error(
                "Error during search:",
                error
            );

            next(error);
        }
    }
);


// ================= 404 ERROR =================

app.all("*", (req, res, next) => {

    next(
        new ExpressError(
            404,
            "Page Not Found"
        )
    );
});


// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {

    const {
        statusCode = 500,
        message = "Something went wrong",
    } = err;

    res.status(statusCode).send(message);
});


// ================= SERVER =================

app.listen(3003, () => {

    console.log("Server working on port 3003");

    console.log(
        "http://localhost:3003"
    );
});

