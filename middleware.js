const post = require("./models/post_model.js");

const ExpressError = require("./utils/ExpressError.js");
const {postSchema,reviewSchema}=require("./schema_joi.js");

const Review=require("./models/review.js");


module.exports.isLoggedIn=(req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    console.log(req.originalUrl,"|",req.path);
    req.flash("error","You must be logged in !");
    return res.redirect("/login");
}
 next();

}
module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner=async(req,res,next)=>{
    const { id } = req.params;
    
    console.log(id);
  const findedpost=await  post.findById(id);
  console.log(findedpost);
  if(!findedpost.owner.equals(res.locals.currUser._id)){
req.flash("error","You don't have permission beacuse You are not Owner");
return res.redirect(`/posts/${id}`);

}
next();

};


module.exports.validatepost=(req,res,next)=>{
    const {error}=postSchema.validate(req.body);
    console.log(error);
    if(error){
        let errmsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}


module.exports.validateReview=(req,res,next)=>{
    const{error}= reviewSchema.validate(req.body);
    console.log(error);
    if(error){
     let errmsg=error.details.map((el)=> el.message).join(",");
     throw new ExpressError(401,errmsg);
    }else{
     next();
    }
 }
 

 module.exports.isReviewAuthor=async(req,res,next)=>{
    const { id,reviewId } = req.params;
    
    console.log(reviewId);
  const review=await  Review.findById(reviewId);

  console.log(review);
  if(!review.author.equals(res.locals.currUser._id)){
req.flash("error","You don't have permission beacuse You are not author of this review");
return res.redirect(`/posts/${id}`);

}
next();

};