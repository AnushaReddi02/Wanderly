module.exports.isLoggedIn = (req,res,next) => {
    console.log(req.user);
     if(!listing){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","❌ Listing you requested for doesen't exist");
        return res.redirect("/listings")
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirect = req.session.redirectUrl;
    }
    next();
}