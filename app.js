const express = require('express');
const app = express();

const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://127.0.0.1:27017/test';

main().then(() => {
    console.log('MongoDB connection successful!!!');
})
 .catch((err) => {
    console.log(err);
 });
 
async function main(){
    await mongoose.connect(MONGO_URL);
}

//PORT : A number where your server listens
//request goes to that port
// process.env.PORT || 3000; -> Works in local + production
// Hosting platforms assign ports dynamically
const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.send("Hi I am Home page!");
});
// Starts the Express server and listens for incoming requests on the specified port
// Without this line → your app does NOTHING.
app.listen(PORT, () => {
    console.log(`Sever is listening on port ${PORT}`);
});