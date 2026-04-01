const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const CustomErrorHandler = require("../utils/CustomErrorHandler.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

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
router.get("/",wrapAsync(listingController.index));

//New Route : Used to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route : Show entire details of a specific listing(based on ID)
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route : Adds the newly created route to database
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.creatingListing)
);


//EDIT : Lets us edit an existing listing
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing));

//UPDATE ROUTE
router.put("/:id", isLoggedIn, wrapAsync(listingController.updateListing));

//DELETE Route
router.delete("/:id",wrapAsync(listingController.destroyListing));

module.exports = router;