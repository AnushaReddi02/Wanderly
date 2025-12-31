const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderly';

main()
 .then(() => {
    console.log("Successfully connected to MONGODB from index.js (Initialization of DB)");
 })
 .catch((err)=>{
    console.log(err);
 });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({}); //Clears already present data from Listing collection
    await Listing.insertMany(initData.data); //Adds the data from data.js into the Listing collection

    console.log("Data base was successfully initialized with sample data!!!");
}

initDB();