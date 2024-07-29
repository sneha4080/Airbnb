const express = require('express')
const router = express.Router();

// Index-users
router.get("/users",(req,res)=>{
    res.send("Get for users")
})
// Show-users
router.get("/users/:id",(req,res)=>{
    res.send("Get for  users id")
})

// Post-usets
router.post("/users",(req,res)=>{
    res.send("POST  for show users")
})

// Delete-users
router.get("/users/:id",(req,res)=>{
    res.send("DELETE  users id")
})

module.exports = router;