const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");



//Index Route
router.get("/",wrapAsync(listingController.index));

//New Route : Used to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route : Show entire details of a specific listing(based on ID)
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route : Adds the newly created route to database
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing)
);


//EDIT : Lets us edit an existing listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//UPDATE ROUTE
router.put("/:id", isLoggedIn,isOwner, wrapAsync(listingController.updateListing));

//DELETE Route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;