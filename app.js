/*
        IMPORTANT ROUTE ORDER NOTE 🚨

        Express matches routes from TOP to BOTTOM.

        If a dynamic route like `/listings/:id` is defined BEFORE
        a static route like `/listings/new`, then:

        Request:
            /listings/new

        Will be interpreted as:
            id = "new"

        Mongoose then tries:
            Listing.findById("new")

        Which causes this error:
            CastError: Cast to ObjectId failed for value "new"

        ✅ SOLUTION:
        Always place STATIC routes (like /new, /edit) 
        BEFORE dynamic routes (/:id).

        Correct order:
        1️⃣ /listings/new
        2️⃣ /listings/:id

*/

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path =require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require("connect-flash");

app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires:new Date(Date.now()+7*24*60*60*1000), //Set this cookie to expire 7 days from now,(7 * 24 * 60 * 60 * 1000->This converts 7 days → milliseconds)
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
};

//ROUTES
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderly';

main().then(() => {
    console.log('MongoDB connection successful!!!');
})
 .catch((err) => {
    console.log(err);
 });

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

//PORT : A number where your server listens
//request goes to that port
// process.env.PORT || 3000; -> Works in local + production
// Hosting platforms assign ports dynamically
const PORT = process.env.PORT || 3000;



app.get("/", (req,res)=>{
    res.send("Hi I am Home page!");
});

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My home",
//         description : "By the beach",
//         price : 12000,
//         location : "HYD",
//         country : "Ïnd"
//     });

//    await sampleListing.save();
//    console.log("Sample was saved");
//    res.send("Sucessful testing");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

// Starts the Express server and listens for incoming requests on the specified port
// Without this line → your app does NOTHING.



/* Catch all routes that are not defined (404 handler)
app.all("*") matches any HTTP method and any route
If no route is found, create a custom 404 error
Pass error to centralized error-handling middleware */

//app.all("*",(req,res,next) => {
//    next(new CustomErrorHandler(404,"Page Not Found"));
//});

app.use((req,res,next)=>{
    res.status(404).send("404 - Page Not Found");
});

//CUSTOM ERROR HANDLER
app.use((err,req,res,next) => {
    /* Global 404 handler.
    Express executes middleware in order, so when no route matches,
    this middleware catches the request and sends a
    "404 - Page Not Found" response to the client. */
    
    let {statusCode = 500,message = "Something Went Wrong"} = err;
    res.render("error.ejs",{err});
});

app.listen(PORT, () => {
    console.log(`Sever is listening on port ${PORT}`);
});


/* 
    EJS-Mate is used to create a common layout for all pages
    It avoids repeating HTML structure like <head>, navbar, and footer
    <%- body %> dynamically injects page-specific content

    include() is used for small reusable parts like navbar or footer
    include() only inserts code, but EJS-Mate supports full page layouts
    Advantage of EJS-Mate: cleaner code, less repetition, better scalability
*/