const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const CustomErrorHandler = require("../utils/CustomErrorHandler.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


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
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route : Used to create a new listing
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route : Adds the newly created route to database
router.post("/", validateListing, wrapAsync(async(req,res,next)=>{
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
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
    })
);

//Show Route : Show entire details of a specific listing(based on ID)
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    //Find the listing using id
    const listing = await Listing.findById(id).populate("reviews"); //It gives entire listing not just id
    res.render("listings/show.ejs",{listing});
}));

//EDIT : Lets us edit an existing listing
router.get("/:id/edit",wrapAsync(async(req,res)=>{
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
router.put("/:id",wrapAsync(async(req,res)=>{
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
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;