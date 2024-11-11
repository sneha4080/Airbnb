const express = require('express')
const app = express();
const users = require("./routes/users.js")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const flash = require('connect-flash');
const path = require('path');


app.set("view engine", "ejs") //express ne use karva
app.set("views", path.join(__dirname, "views"));


const sessionOptions = {
    secret: "mywebsecreate",
    resave: false, 
    saveUninitialized: true
}


// directly session option ne use karay
// app.use(cookieParser());cd
app.use(session(sessionOptions));
app.use(flash()); //flash use

// MESS NE MIDDLEWARE THI PASS KARVA 
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});


// LECT-4 //lect -1 less thi
app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    // console.log(req.session.name); //by default cookie aave
    
    
    if (name === "anonymous") {
        req.flash("error", "User not registered");
    } else {
        req.flash("success", "User registered successfully");
    }
    res.redirect("/hello");//sem route
});
app.get("/hello",(req,res)=>{
    //   res.send(`Hi ${req.session.name}`)

    res.render("page.ejs",{name : req.session.name }) ;//name varible access thay page.ejs thi
    // msg ma store ari key & mess pair ma use karyu
    // msg ne page.ejs ma use karvu psade to jappear thay 
})



// LECT-3
// Test count num of request
// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`you sent request ${req.session.count} times`);

// })

// LECT-2
// app.get("/test",(req,res)=>{
//     res.send("test successful")
// })

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi i am root");
})





app.listen(3000, () => {
    console.log("server is working");
})




// COOKIES LECTURE


app.use(cookieParser());//use the cookieParser so evry request irst to camecooki

app.use(cookieParser("secreatecode"));//temering detect thay cookies jode thi

app.use("/users", users)


app.get("/getsignedcookie", (req, res) => {
    res.cookie("made-in", "india", { signed: true });
    res.send("signed cookies sent")
});

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "Hello");
    res.cookie("origin", "india");
    res.send("sent new cookies");
});

app.get("/verify", (req, res) => {
    console.log(req.cookies);
    res.send("verified");
})


app.get("/greet", (req, res) => {
    let { name = "anoymous" } = req.cookies;
    res.send(`Hi,${name}`);
})

