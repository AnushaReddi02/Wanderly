const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middlewares.js");


// CREATE REVIEW ROUTE
router.post("/", isLoggedIn , validateReview, wrapAsync(async (req, res) => {

    // 1️⃣ Get listing ID from URL params
    const { id } = req.params;

    // 2️⃣ Find the corresponding listing in database
    const listing = await Listing.findById(id);

    // 3️⃣ Create a new review using form data
    const newReview = new Review(req.body.review);

    // Assosiating authore to the review
    newReview.author = req.user._id;
    console.log(newReview);

    // 4️⃣ Add review reference to listing's reviews array
    listing.reviews.push(newReview);

    // 5️⃣ Save review to database
    await newReview.save();

    // 6️⃣ Save updated listing (with new review added)
    await listing.save();

    // 7️⃣ Log success message (for debugging)
    console.log("Review created and saved successfully!");
    console.log("Listing updated with new review!");

    req.flash("success","Review Added 🎉");
    // 8️⃣ Redirect user (important)
    res.redirect(`/listings/${id}`);
}));

// DELETE REVIEW ROUTE
router.delete("/:reviewId", isLoggedIn , isReviewAuthor , wrapAsync(async (req, res) => {

    const { id, reviewId } = req.params;

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // Delete review from database
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","❗Review Deleted");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;