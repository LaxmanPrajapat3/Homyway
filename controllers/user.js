

const User = require("../models/user.js");

module.exports.renderSignUpFrom= (req, res) => {
    res.render("user/signup.ejs");
}


module.exports.userSignUp=async (req, res, next) => {

    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to HomyWay!");

            res.redirect("/posts");
        })
    }
    catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginFrom=(req, res) => {
    res.render("user/login.ejs");
}

module.exports.userLogin=async (req, res) => {

    let { username, password } = req.body;

    req.flash("success", "Welcome back to HomyWay! you are logged in!");
let redirectUrl=res.locals.redirectUrl || "/posts";

    res.redirect(redirectUrl);
}

module.exports.userLogout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out !");
        res.redirect("/posts");
    })
}