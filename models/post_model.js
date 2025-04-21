const mongoose=require("mongoose");
const Review=require("./review.js");
const { string } = require("joi");
const dbUrl=process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
};

//connect to mongoose db

main().then(()=>{

    console.log("connection to database is sucessful");
}).catch((err)=>{
console.log(err);
})

const postStrucutre=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image_url:{
        url:String,
        filename:String,
        
      
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
type:String,
required:true,
    },
    country:{
type:String,
requried:true,
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }

});

postStrucutre.post("findOneAndDelete",async(posting)=>{
  await Review.deleteMany({_id:{$in:posting.reviews}})  
})

const post=mongoose.model("post",postStrucutre);
module.exports=post;

