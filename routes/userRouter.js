const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsyc = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const usersController = require("../controllers/user.js");


router.route("/signup").get(usersController.renderSignUpFrom)
    .post(wrapAsyc(usersController.userSignUp))


router.route("/login").get(usersController.renderLoginFrom).post(savedRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), usersController.userLogin)









router.get("/logout", usersController.userLogout);

module.exports = router;