// Import the Listing model (used to interact with the database)
const Listing = require("../models/listing");

// Controller function to handle request for showing all listings
module.exports.index = async (req, res) => {

    // Fetch all listings from the database
    // {} means no filter → get everything
    const allListings = await Listing.find({});

    // Render the 'index.ejs' view inside 'listings' folder
    // Pass the fetched data (allListings) to the view
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error","⚠️ You must login to Add a Listing");
       return res.redirect("/login");
    }
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    //Find the listing using id
    const listing = await Listing.findById(id).populate("reviews").populate("owner"); //It gives entire listing not just id
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res,next)=>{
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
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created 🎉");
        res.redirect("/listings");
};

module.exports.editListing = async(req,res)=>{
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
    if(!listing){
        req.flash("error","❌ Listing you requested for doesen't exist");
        return res.redirect("/listings")
    }
    req.flash("success","Edited Listing Sucessfully 🎉");
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing = async(req,res)=>{
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
       req.flash("success","Listing Updateded 🎉");
       res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    if(!deletedListing){
        req.flash("error","❌ Listing you requested for doesen't exist");
        return res.redirect("/listings")
    }
    req.flash("success","❗Listing Deleted!");
    res.redirect("/listings");
};



