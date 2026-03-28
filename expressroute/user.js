const express = require("express");
const router = express.Router();
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js")

router.route("/signup")
    .get(userController.renderSignUp)
    .post(userController.signup);

router.route("/login")
    .get(userController.renderLogIn)
    .post(savedRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.logIn);

router.get("/logout", userController.logOut);

module.exports = router;


