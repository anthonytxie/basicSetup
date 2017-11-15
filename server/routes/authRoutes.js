const express = require("express");
const passport = require("passport");

const routes = express();

routes.get("/", (req, res) => {
	res.send("Hello welcome to generic bot");
});

// when users hit login they get directed to here which kicks off the authentication
//passport redirects the user to accounts.google....
routes.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"]
	})
);

// they will have the code and not be kicked into flow... code will be used to get user profile
routes.get("/auth/google/callback", passport.authenticate("google"));

routes.get("/currentuser", (req, res) => {
	res.send(req.user);
});

module.exports = routes;
