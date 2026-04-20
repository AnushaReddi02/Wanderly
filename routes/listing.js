const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");


router
   .route("/")
   .get(wrapAsync(listingController.index))  //Index Route
   //Create Route : Adds the newly created route to database
   .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing)
    );

//New Route : Used to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
   .route("/:id")
   //Show Route : Show entire details of a specific listing(based on ID)
  .get(wrapAsync(listingController.showListing))
  //UPDATE ROUTE
  .put(isLoggedIn,isOwner, wrapAsync(listingController.updateListing))
  //DELETE Route
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

//EDIT : Lets us edit an existing listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;