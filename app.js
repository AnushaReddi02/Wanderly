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
const Listing = require("./models/listing.js");
const path =require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const CustomErrorHandler = require("./utils/CustomErrorHandler.js");
const {listingSchema} = require("./schema.js")
app.use(express.static(path.join(__dirname,"/public")));



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

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errorMessage = error.details.map((el) => el.message).join(",");
            throw new CustomErrorHandler(400,errorMessage);
        }else{
            next();
        }
}

//Index Route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route : Used to create a new listing
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route : Adds the newly created route to database
app.post("/listings", validateListing, wrapAsync(async(req,res,next)=>{
    // let {title,description,image,price,country,location} = req.body;
    // new Listing(req.body.listing)
    // let listing = req.body.listing;
    //if(!req.body.listing){
        /*
          This validation checks if the required object exists in the request body and throws a 400 Bad Request error if not,
           preventing invalid data from being processed. */

        //throw new CustomErrorHandler(400,"Send Valid Data for Listimg");
     // }
        let newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

//Show Route : Show entire details of a specific listing(based on ID)
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    //Find the listing using id
    const listing = await Listing.findById(id); //It gives entire listing not just id
    res.render("listings/show.ejs",{listing});
}));

//EDIT : Lets us edit an existing listing
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);  // It creates a new document/object using the Listing model, filled with data coming from a form request.
/* 
    1️⃣ req -> Contains everything the client sends (form data, params, headers, etc.)
    2️⃣ req.body -> Contains data sent from a POST request,Works only if you use: app.use(express.urlencoded({ extended: true })); OR app.use(express.json());
    3️⃣ req.body.listing
    This means your form data is structured like this:
    <input name="listing[title]" />
    <input name="listing[price]" />
    <input name="listing[location]" />

    So Express converts it into:
    req.body = {
      listing: {
        title: "Beach House",
        price: 5000,
        location: "Goa"
      }
     } 
    👉 We’re extracting only the listing object.
    4️⃣ Listing : (blueprint for listings in MongoDB)
        This is a Mongoose Model
        Created earlier like:
        const Listing = mongoose.model("Listing", listingSchema);

    5️⃣ new Listing(req.body.listing)
        Creates a new Listing object
        But ❗ it is not saved to the database yet
*/
    res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
       /*     { ...req.body.listing }
        This part has two things going on:

        1️⃣ req.body.listing
        Contains the updated data sent from the edit form

        Example:

        req.body.listing = {
        title: "New Title",
        price: 2000,
        location: "Goa"
        };
        2️⃣ ... (spread operator)
        Copies all key–value pairs from req.body.listing

        Turns them into a new object

        So:

        { ...req.body.listing }
        becomes:

        {
        title: "New Title",
        price: 2000,
        location: "Goa"
        }  */
       res.redirect(`/listings/${id}`);
}));

//DELETE Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

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