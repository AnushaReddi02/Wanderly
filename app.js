const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path =require('path');




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

//Show Route : Show entire details of a specific listing(based on ID)
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    //Find the listing using id
    const listing = await Listing.findById(id); //It gives entire listing not just id
    res.render("listings/show.ejs",{listing});
})

// Starts the Express server and listens for incoming requests on the specified port
// Without this line → your app does NOTHING.
app.listen(PORT, () => {
    console.log(`Sever is listening on port ${PORT}`);
});