if(process.env.NODE_ENV !="production"){

require('dotenv').config();

}
const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const postesRouter=require("./routes/postingRouter.js");
const reviewsRouter=require("./routes/reviewRouter.js");
const userRouter=require("./routes/userRouter.js");
const session=require("express-session");
const mongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const local_passport=require("passport-local");
const User=require("./models/user.js");




    
    
    const app = express();
    app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use("ejs",ejsMate);
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl=process.env.ATLASDB_URL;

const store=mongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE : ",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        
    },
    
}


app.use(flash());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local_passport(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    
    res.locals.currUser=req.user;
    next();
})









async function main() {
let res=  await mongoose.connect(dbUrl);
// console.log(res);
};

main().then(() => {

    console.log("connection to database is sucessful");
}).catch((err) => {
    console.log(err);
})





//connect to mongoose db






// _______________________________________________________




// to listen web requests form client side
 app.listen(8000, () => {
    console.log("Server is listening to port 8000");
});

app.use("/posts",postesRouter);

app.use("/posts/:id/reviews",reviewsRouter);
app.use("/",userRouter);




app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

// handle Errors
app.use((err, req, res, next) => {
    let { status = 500, message = "somthing worng" } = err;
    // res.send(message);
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{err});
    
})

