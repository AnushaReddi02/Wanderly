module.exports.isLoggedIn = (req,res,next) => {
    console.log(req.user);
     if(!listing){
        req.flash("error","❌ Listing you requested for doesen't exist");
        return res.redirect("/listings")
    }
    next();
};