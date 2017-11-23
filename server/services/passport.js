const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const facebookStrategy = require("passport-facebook").Strategy;
const localStrategy = require("passport-local").Strategy;

const { User } = require("./../../db/models/index");

// we are serializing the user based on the userID created by mongo then this gets set as the cookie
passport.serializeUser((user, done) => {
	done(null, user.id); //passing user.id to done to serialize
});

//we are deserializing the user based on the cooked userId
passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user); //passing deserialized user object to done
	});
});

//passport makes req.user automatically the user object
// ===============================GOOGLE=============================================

passport.use(
	new googleStrategy(
		{
			clientID: process.env.googleClientId,
			clientSecret: process.env.googleClientSecret,
			callbackURL: "/auth/google/callback" // this is the route the user is sent back to after they grant permission
		},
		(accessToken, refreshToken, profile, done) => {
			User.findByIdOrCreate(accessToken, "google")
				.then(user => {
					done(null, user); //after this user serialization happens
				})
				.catch(err => console.log(err));
		}
	)
);

// ===============================FACEBOOK=============================================
passport.use(
	new facebookStrategy(
		{
			clientID: process.env.facebookAppId,
			clientSecret: process.env.facebookAppSecret,
			callbackURL: "/auth/facebook/callback"
		},
		function(accessToken, refreshToken, profile, done) {
			User.findByIdOrCreate(accessToken, "facebook")
				.then(user => {
					done(null, user); //after this user serialization happens
				})
				.catch(err => console.log(err));
		}
	)
);

// ===============================LOCAL SIGN UP=============================================

passport.use(
	"local-signup",
	new localStrategy(
		{
			// by default, local strategy uses username and password, we will override with email
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
		},
		function(req, email, password, done) {
			User.findByIdOrCreate(email, "local", password)
				.then((user) => {
					done(null, user)
				})
				.catch(err => console.log(err))
		}
	)
);
