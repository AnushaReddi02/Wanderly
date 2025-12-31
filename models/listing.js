// This file defines the Listing schema and model.
// The schema describes the structure of listing data,
// and the exported model is used throughout the application
// to interact with the listings collection in the database.


// A listing is one item or entry that is displayed on a website as part of a collection.


//Import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema //we can use Schema instead of writing mongoose.Scheema everytime.

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
    country : String
});

//Creating a model using listingSchema
const Listing = mongoose.model("Listing",listingSchema);

//exporting the Listing model
module.exports = Listing;
