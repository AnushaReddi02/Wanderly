// This file defines the Listing schema and model.
// The schema describes the structure of listing data,
// and the exported model is used throughout the application
// to interact with the listings collection in the database.


// A listing is one item or entry that is displayed on a website as part of a collection.


//Import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema //we can use Schema instead of writing mongoose.Scheema everytime.
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        type : String,
        default : "https://unsplash.com/photos/green-leafed-tree-surrounded-by-fog-during-daytime-S297j2CsdlM",
        // Setter function: assigns a default image link when no image is provided
        set : (v) =>
             v === "" 
                ? "https://unsplash.com/photos/green-leafed-tree-surrounded-by-fog-during-daytime-S297j2CsdlM"
                : v
    }, 
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,   //All the reviews related to the particular listing will be stored here
            ref : "Review"
        }
    ]
});

// Mongoose post middleware for cascading delete
// This runs after a listing is deleted
listingSchema.post("findOneAndDelete",async(listing) => {
    console.log("🔥 Middleware triggered");
     // Check if listing exists
    if(listing){
        // Delete all reviews whose IDs are present in listing.reviews
        // $in operator matches all review IDs in the array
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

//Creating a model using listingSchema
const Listing = mongoose.model("Listing",listingSchema);

//exporting the Listing model
module.exports = Listing;
