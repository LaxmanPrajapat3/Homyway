const express = require("express");
const router = express.Router();
const WarapAsyc = require("../utils/wrapAsyc.js");


const { isLoggedIn, isOwner, validatepost } = require("../middleware.js");
const postsController=require("../controllers/posts.js");


const multer = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage});
router
.route("/:id")
.get( WarapAsyc(postsController.showPost))
.put( isLoggedIn, isOwner, upload.single('posting[image_url]'),validatepost, WarapAsyc(postsController.updatePost))
.delete( isLoggedIn, isOwner, WarapAsyc(postsController.deletePost))




// to show all posts names
router.get("/", WarapAsyc(postsController.index))




//To Open from to enter new posts
router.get("/form/new", isLoggedIn,postsController.renderNewform )


// Add new posts in database
router.post("/add", isLoggedIn, upload.single('posting[image_url]'),validatepost, WarapAsyc(postsController.addNewPostInDb)
);


// crete a rout for open edit from
router.get("/:id/edit", isLoggedIn, isOwner, WarapAsyc(postsController.renderEditForm))





module.exports = router;