const express = require("express");
const passport = require("passport");

const routes = express();

routes.get("/", (req, res) => {
	res.render("index.ejs");
});

// ===============================GOOGLE=============================================
// when users hit login they get directed to here which kicks off the authentication
//passport redirects the user to accounts.google....
routes.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"]
	})
);

// they will have the code and not be kicked into flow... code will be used to get user profile
routes.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		// Successful authentication, redirect home.
		res.redirect("/currentuser");
	}
);
// ===============================FACEBOOK=============================================

routes.get("/auth/facebook", passport.authenticate("facebook"));

routes.get(
	"/auth/facebook/callback",
	passport.authenticate("facebook", { failureRedirect: "/login" }),
	(req, res) => {
		// Successful authentication, redirect home.
		res.redirect("/currentuser");
	}
);

// ===============================LOCAL=============================================

routes.get("/currentuser", (req, res) => {
	res.send(req.user);
});

routes.get("/logout", (req, res) => {
	req.logout();
});
module.exports = routes;
