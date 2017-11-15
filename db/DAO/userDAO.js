const User = require("./../models/User");

let userDAO = {};

userDAO.initializeGoogleUser = googleId => {
	return new Promise((resolve, reject) => {
		User.findOne({
			googleId
		})
			.then(user => {
				if (user) {
					return user;
				} else {
					let user = new User({ googleId });
					return user.save();
				}
			})
			.then(user => {
				resolve(user);
			})
			.catch(err => {
				reject(err);
			});
	});
};

userDAO.initializeFacebookUser = facebookId => {
	return new Promise((resolve, reject) => {
		User.findOne({
			facebookId
		})
			.then(user => {
				if (user) {
					return user;
				} else {
					let user = new User({ facebookId });
					return user.save();
				}
			})
			.then(user => {
				resolve(user);
			})
			.catch(err => {
				reject(err);
			});
	});
};

userDAO.findById = id => {
	return new Promise((resolve, reject) => {
		User.findById(id)
			.then(user => {
				resolve(user);
			})
			.catch(err => reject(err));
	});
};

module.exports = userDAO;
