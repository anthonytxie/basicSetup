const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
	googleId: String,
	facebookId: String,
	email: String,
	password: String
});

userSchema.statics.findByIdOrCreate = function(identifier, strategy, password) {
	switch (strategy) {
		case "facebook":
			return this.findOne({ facebookId: identifier }).then(user => {
				if (!user) {
					let newUser = new User({ facebookId: identifier });
					return newUser.save();
				} else {
					return user;
				}
			});
			break;
		case "google":
			return this.findOne({ facebookId: identifier }).then(user => {
				if (!user) {
					let newUser = new User({ facebookId: identifier });
					return newUser.save();
				} else {
					return user;
				}
			});
			break;
		case "local":
			return this.findOne({
				email: identifier.toLowerCase()
			}).then(user => {
				if (!user) {
					let newUser = new User({
						email: identifier.toLowerCase(),
						password
					});
					return newUser.save();
				} else {
					return new Promise((resolve, reject) => {
						bcrypt.compare(password, user.password, (err, res) => {
							if (res) {
								console.log('YES')
								resolve(user);
							} else {
								console.log('NOONONONO')
								reject(user);
							}
						});
					});
				}
			});
			break;
		default:
			console.log("No idea what shit strategy was used");
	}
};

userSchema.pre("save", function(next) {
	let user = this;

	if (user.isModified("password")) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, null, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
