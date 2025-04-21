const express=require("express");

const router=express.Router({mergeParams:true});
const WarapAsyc = require("../utils/wrapAsyc.js");


const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewsController=require("../controllers/review.js");

router.post("/",isLoggedIn,validateReview,WarapAsyc(reviewsController.addReview
))

//Delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,WarapAsyc(reviewsController.deleteReview))

module.exports=router;