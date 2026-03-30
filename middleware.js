const Listing = require("./models/listing.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next) =>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login for create new listing!!");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
     let { id } = req.params;
     let listing =  await Listing.findById(id);
     if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to do changes!");
        return  res.redirect(`/listing/${id}`);
     }
     next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);

    } else {
        next();
    }
};

// Middleware to validate review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error.details.map(el => el.message).join(","));
  }
  next();
};

module.exports.isCreatedBy = async(req,res,next)=>{
     let { id,reviewId } = req.params;
     let review =  await Review.findById(reviewId);
     if(!review.createdBy.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to do changes!");
        return  res.redirect(`/listing/${id}`);
     }
     next();
};
