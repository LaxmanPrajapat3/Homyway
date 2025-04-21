const mongoose=require("mongoose");
const alldata=require("./data.js");
const postcollection=require("../models/post_model.js");
async function main() {
    // await mongoose.connect("mongodb://127.0.0.1:27017/homyway");
};





//connect to mongoose db

main().then(()=>{

    console.log("connection to database is sucessful");
}).catch((err)=>{
console.log(err);
})

const initDb=async()=>{
    await postcollection.deleteMany({});
alldata.data=alldata.data.map((obj)=>({
    ...obj,
    owner: "67ff737773843e0293a2fc26"
}))

   await postcollection.insertMany(alldata.data);

};
initDb();


