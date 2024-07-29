const express = require('express')
const router = express.Router();

// POSTS route
router.get("/posts",(req,res)=>{
    res.send("Get for postss")
})
// Show
router.get("/posts/:id",(req,res)=>{
    res.send("Get for  posts id")
})

// Post
router.post("/posts",(req,res)=>{
    res.send("POST  for show posts")
})

// Delete
router.get("/posts/:id",(req,res)=>{
    res.send("DELETE  posts id")
})

module.exports = router;
