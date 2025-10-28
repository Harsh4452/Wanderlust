const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing=require("../models/Listing.js");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");


//8 review route
router.post("/",
    isLoggedIn,
    validateReview,wrapAsync(reviewController.createReview))

//9 delete review route
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;
