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

// Check if the app is NOT running in production mode
// (i.e., it's running locally on your laptop during development)
if (process.env.NODE_ENV != "production") {
    
    // Load environment variables from a .env file into process.env
    // This allows you to use things like DB URLs, API keys safely
    require('dotenv').config();
}


/*
        🔹 process.env.NODE_ENV
        This tells your app what environment it is running in
        Common values:
        "development" → when you're coding locally
        "production" → when app is deployed (like on a server)
*/
// console.log(process.env.SECRET);


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path =require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

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
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const MONGO_URL = process.env.MONGO_URL;

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



/* app.get("/", (req,res)=>{
    res.send("Hi I am Home page!");
}); */

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

// Initialize Passport
app.use(passport.initialize());

// Enable persistent login sessions
app.use(passport.session());

// Configure Passport to use Local Strategy (username + password authentication)
// User.authenticate() is provided by passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));

// Serialize user: decides what data of the user is stored in the session
// Here, it stores only the user ID in the session
passport.serializeUser(User.serializeUser());

// Deserialize user: retrieves full user details from the database using the stored ID
// The retrieved user object is attached to req.user in every request
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Demo route to create and register a fake user (for testing purposes)
/*    app.get("/demoUser", async (req, res) => {

    // Create a new user object (without password)
    let fakeUser = new User({
        email: "a@gmail.com",
        username: "fakeUser1"
    }); 

    // Register the user using passport-local-mongoose
    // This method automatically:
    // 1. Hashes the password
    // 2. Stores the user in the database
    // 3. Adds salt + hash fields
    let registeredUser = await User.register(fakeUser, "DummyPassword123");

    // Send the registered user as response
    res.send(registeredUser);
});  */

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

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