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

//Index Route
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//New Route : Used to create a new listing
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route : Adds the newly created route to database
app.post("/listings", async(req,res)=>{
    // let {title,description,image,price,country,location} = req.body;
    // new Listing(req.body.listing)
    // let listing = req.body.listing;
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Show Route : Show entire details of a specific listing(based on ID)
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    //Find the listing using id
    const listing = await Listing.findById(id); //It gives entire listing not just id
    res.render("listings/show.ejs",{listing});
});

//EDIT : Lets us edit an existing listing
app.get("/listings/:id/edit",async(req,res)=>{
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
});

//UPDATE ROUTE
app.put("/listings/:id",async(req,res)=>{
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
});

//DELETE Route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// Starts the Express server and listens for incoming requests on the specified port
// Without this line → your app does NOTHING.
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