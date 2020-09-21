const bcrypt = require('bcrypt');

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