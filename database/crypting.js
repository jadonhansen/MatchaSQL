const bcrypt = require('bcrypt');

exports.cryptPassword = function(password) {
	return new Promise ( (resolve, reject) => {
		let salt = bcrypt.genSaltSync();
		if (!salt) return reject("Failed to generate salt");

		let hash = bcrypt.hashSync(password, salt);
		return resolve(hash);
	});
}

exports.comparePassword = function(password, hash) {
	return new Promise ( (resolve, reject) => {
		bcrypt.compare(password, hash, function(err, res) {

			if (res) {
				resolve("Password match");
			} else {
				reject("Password mismatch");
			} 
		});
	});
};