const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const userDAO = require("./../../db/DAO/userDAO");

// we are serializing the user based on the userID created by mongo then this gets set as the cookie
passport.serializeUser((user, done) => {
	done(null, user.id); //passing user.id to done to serialize
});

//we are deserializing the user based on the cooked userId
passport.deserializeUser((id, done) => {
	userDAO.findById(id).then(user => {
		done(null, user); //passing deserialized user object to done
	});
});

//passport makes req.user automatically the user object

passport.use(
	new googleStrategy(
		{
			clientID: process.env.googleClientId,
			clientSecret: process.env.googleClientSecret,
			callbackURL: "/auth/google/callback" // this is the route the user is sent back to after they grant permission
		},
		(accessToken, refreshToken, profile, done) => {
			userDAO
				.initializeGoogleUser(profile.id)
				.then(user => {
					done(null, user); //after this user serialization happens
				})
				.catch(err => console.log(err));
		}
	)
);
