const express = require('express'); // Correct, for example
const route = require('./listing');
const router = express.Router();
const User = require("../models/user.js");
const user = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../Controllers/user.js")


router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(
        userController.signupRoute
    )
    )

router.route("/login")
    .get(userController.renderLoginForm)
  .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.Login
    );

router.get("/logout",
    userController.Logout
);

module.exports = router;