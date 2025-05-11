const { json } = require("express");
const post=require("../models/post_model.js");
const { layout } = require("ejs-mate");

module.exports.index=async (req, res) => {
    const allposts = await post.find({});
    res.render("./posts_collections/index.ejs", { allposts });
    console.log(`threse are posts : ${allposts}`);


};
module.exports.showPost=async (req, res) => {
    let { id } = req.params;
    const showpost = await post.findById(id).populate(
        { path: "reviews", populate: { path: "author" }, }).populate("owner");
        if (!showpost) {
            req.flash("error", "Post Does not exist ");
            res.redirect("/posts");
        }
        const url=`https://api.opencagedata.com/geocode/v1/json?q=${showpost.location}&limit=1&key=${process.env.OPENCAGE_GEOCODING_API_KEY}`
    console.log(showpost.location);

 const fetchRes= await fetch(url);
 
 

 const data=await fetchRes.json();
 console.log("This is data conversion --> ",data);
 

  
        if(data.results.length){

        
        const {lat,lng}=data.results[0].geometry;
    
        console.log(lat," ",lng);
    res.render("./posts_collections/show.ejs", { showpost,lat,lng });

}else{
   
const lat=50,lng=56;
    res.render("./posts_collections/show.ejs", { showpost,lat,lng });

}
};

module.exports.renderNewform=(req, res) => {

    res.render("./posts_collections/new.ejs");
}

module.exports.addNewPostInDb=async (req, res, next) => {

let url=req.file.path;
let filename=req.file.filename;
console.log(url,"....",filename);


    const newposting = new post(req.body.posting);
    console.log(req.user);
    newposting.owner = req.user._id;
    newposting.image_url={url,filename};

    console.log(req.body.posting);
    await newposting.save();
    req.flash("success", "New Post Created ");
    res.redirect("/posts");

}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const editablepost = await post.findById(id);
    if (!editablepost) {
        req.flash("error", "Post Does not exist ");
        res.redirect("/posts");
    }
let originalImageUrl=editablepost.image_url.url;
originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
console.log("it is low pixes image url: ",originalImageUrl);

    res.render("./posts_collections/edit.ejs", { editablepost,originalImageUrl });
}

module.exports.updatePost=async (req, res) => {

    console.log("put is work");
    const { id } = req.params;

    console.log(id);



  const updatedPost=  await post.findByIdAndUpdate(id, { ...req.body.posting })
  if(typeof req.file !="undefined"){


      let url=req.file.path;
      let filename=req.file.filename;
      updatedPost.image_url={url,filename};
      await updatedPost.save();

  }




    req.flash("success", "Post updated");

    res.redirect(`/posts/${id}`);

}
module.exports.deletePost=async (req, res) => {
    let { id } = req.params;

    post.findByIdAndDelete(id).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
    req.flash("success", " Post Deleted ");

    console.log("Deletion is Sucessful");
    res.redirect("/posts");

}