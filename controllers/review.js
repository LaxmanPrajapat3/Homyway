const Review=require("../models/review.js");
const post = require("../models/post_model.js");

module.exports.addReview= async(req,res)=>{
    console.log("request is recived");
  

let reViewedPost=await post.findById(req.params.id);
const newReview=new Review(req.body.review);
newReview.author=req.user._id;

console.log(newReview);
;
 reViewedPost.reviews.push(newReview);

const result1=await newReview.save();
const result2=await reViewedPost.save();

console.log(result2);
req.flash("success","New Review added ");

console.log("Reviwed saved");

    res.redirect(`/posts/${reViewedPost._id}`);
}


module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(`post id is ${id}`);
    console.log(`reviewId id is ${reviewId}`);
     
    let result=await post.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    let result2=await Review.findByIdAndDelete(reviewId);
    console.log(result);
    console.log(result2);
    req.flash("success"," Review Deleted ");
    
    
        console.log("Review is Deleted");
        res.redirect(`/posts/${id}`);
    }
