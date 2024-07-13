const express = require('express'); // Correct, for example
const  route  = require('./listing');
const router = express.Router();
const User = require("../models/user.js");
const user = require('../models/user.js');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})


router.post("/signup",async(req,res)=>{
    let {username,email,password} = req.body;
    const newUser = new User = ({email,username});
   const registerUser =  await User.register(newUser,password); //register katvav
   console.log(registerUser);
   req.flash("success","Welcome to Wanduerlust!");
   res.redirect("/listing");

})


module.exports = router;