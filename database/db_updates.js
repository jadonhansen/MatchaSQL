const db = require('./config');
const mysql = require('mysql');

class Updates {

	constructor() {
		this.connection = mysql.createConnection({
			host: `${db.servername}`,
			user: `${db.dbusername}`,
			password: `${db.dbpassword}`,
			port: `${db.dbport}`,
			database: `${db.dbname}`
		});
	}

	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows) => {
				if (err) return reject(err);
				return resolve(rows);
			});
		});
	}

	// Getting user by username
	get_user(username) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM users WHERE username = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let userExists = this.query(sql);

			userExists.then(function (ret) {
				if (!ret[0])
					return reject("User does not exist.");
				resolve(ret[0]);
			}, function (err) {
				reject(err);
			});
		});
	}	

	// Updating password from profile page
	updatePassword(password, username) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET password = ? WHERE username = ?";
			let inserts = [password, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);
			
			updatedUsr.then(function (ret) {
				console.log('Updated Password Succesfully');
				resolve(ret);
			}, function (err) {
				console.log('Unable To Update Password');
				reject("Failed to validate query.");
			});
		});
	}

	// Updates verif string and verif email when a user resets their email from profile
	updateVerifAndVerifEmail(safe, email, username) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET verif = ?, verif_email = ? WHERE username = ?";
			let inserts = [safe, email, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);

			updatedUsr.then(function (ret) {
			   console.log('Updated Verif Email and Verif Succesfully');
			   resolve(ret);
			}, function (err) {
			   console.log('Unable To Update Verif Email and Verif');
			   reject("Failed to validate query.");
			});
		});
	}

	// Update users location preference
	updateLocationStatus(username, status) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET location_status = ? WHERE username = ?";
			let inserts = [status, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);
			
			updatedUsr.then(function (ret) {
				console.log('Updated Location Status Succesfully');
				resolve(ret);
			}, function (err) {
				console.log('Unable To Update Location Status');
				reject("Failed to validate query.");
			});
		});
	}

	// Update users bio
	updateBio(username, bio) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET bio = ? WHERE username = ?";
			let inserts = [bio, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);
			
			updatedUsr.then(function (ret) {
				console.log('Updated Bio Succesfully');
				resolve(ret);
			}, function (err) {
				console.log('Unable To Update Bio');
				reject("Failed to validate query.");
			});
		});
	}

	// Update username
	updateUsername(username, newUser) {
		return new Promise((resolve, reject) => {

			let outcome = this.get_user(newUser);
			let a = this;

			outcome.then(function (ret) {
				console.log('Username Already Exists');
			}, function (err) {
				let sql = "UPDATE users SET username = ? WHERE username = ?";
				let inserts = [newUser, username];
				sql = mysql.format(sql, inserts);
				let updatedUsr = a.query(sql);
				
				updatedUsr.then(function (ret) {
					console.log('Updated Username Succesfully');
					resolve(ret);
				}, function (error) {
					console.log('Unable To Update Username');
					reject("Failed to validate query.");
				});
			});
		});
	}

	// Update name
	updateName(username, name) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET name = ? WHERE username = ?";
			let inserts = [name, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);

			updatedUsr.then(function (ret) {
				console.log('Updated Name Succesfully');
				resolve(ret);
			}, function (error) {
				console.log('Unable To Update Name');
				reject("Failed to validate query.");
			});
		});
	}

	// Update surname
	updateSurname(username, surname) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET surname = ? WHERE username = ?";
			let inserts = [surname, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);

			updatedUsr.then(function (ret) {
				console.log('Updated Surname Succesfully');
				resolve(ret);
			}, function (error) {
				console.log('Unable To Update Surname');
				reject("Failed to validate query.");
			});
		});
	}

	// Update age
	updateAge(username, age) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET age = ? WHERE username = ?";
			let inserts = [age, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);

			updatedUsr.then(function (ret) {
				console.log('Updated Age Succesfully');
				resolve(ret);
			}, function (error) {
				console.log('Unable To Update Age');
				reject("Failed to validate query.");
			});
		});
	}

	// Update gender
	updateGender(username, gender) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET gender = ? WHERE username = ?";
			let inserts = [gender, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);

			updatedUsr.then(function (ret) {
				console.log('Updated Gender Succesfully');
				resolve(ret);
			}, function (error) {
				console.log('Unable To Update Gender');
				reject("Failed to validate query.");
			});
		});
	}

	// Update prefferances
	updatePreffs(username, prefferances) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET prefferances = ? WHERE username = ?";
			let inserts = [prefferances, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);

			updatedUsr.then(function (ret) {
				console.log('Updated Prefferances Succesfully');
				resolve(ret);
			}, function (error) {
				console.log('Unable To Update Prefferances');
				reject("Failed to validate query.");
			});
		});
	}	

	// Add tag to profile
	addTag(username, tag) {
		return new Promise((resolve, reject) => {

			let sql = "INSERT INTO tags (user, tag) VALUES (?, ?)";
			let inserts = [username, tag];
			sql = mysql.format(sql, inserts);
			let newEntry = this.query(sql);

			newEntry.then(function (ret) {
				console.log('Added Tag Succesfully');
				resolve(ret);
			}, function (error) {
				console.log('Unable To Add Tag');
				reject("Failed to validate query.");
			});
		});
	}

	// Remove tag from profile
	removeTag(username, tag) {
		return new Promise((resolve, reject) => {

			let sql = "DELETE FROM tags WHERE tag = ? AND user = ?";
			let inserts = [tag, username];
			sql = mysql.format(sql, inserts);
			let res = this.query(sql);

			res.then(function (ret) {
				console.log('Deleted Tag Succesfully');
				resolve(ret);
			}, function (error) {
				console.log('Unable To Delete Tag');
				reject("Failed to validate query.");
			});
		});
	}

	// Uploading profile images
	uploadImages(username, image, chosen) {
		return new Promise((resolve, reject) => {

			let sql;
			switch (chosen) {
				case 0:
					sql = "UPDATE users SET main_image = ? WHERE username = ?";
					break;
				case 1:
					sql = "UPDATE users SET image_one = ? WHERE username = ?";
					break;
				case 2:
					sql = "UPDATE users SET image_two = ? WHERE username = ?";
					break;
				case 3:
					sql = "UPDATE users SET image_three = ? WHERE username = ?";
					break;
				case 4:
					sql = "UPDATE users SET image_four = ? WHERE username = ?";
					break;
				default:
					return reject('Unacceptable Image Number');
			}
			let inserts = [image, username];
			sql = mysql.format(sql, inserts);
			let res = this.query(sql);

			res.then(function (ret) {
				console.log('Updated Image Succesfully');
				resolve(ret);
			}, function (error) {
				console.log('Unable To Update Image');
				reject("Failed to validate query.");
			});
		});
	}

	// Updates status when a user logs off or logs on
	updateStatus(username, status) {
		return new Promise((resolve, reject) => {

			let sql = "UPDATE users SET status = ? WHERE username = ?";
			let inserts = [status, username];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);

			updatedUsr.then(function (ret) {
				console.log('Updated Status Succesfully');
				resolve(ret);
			}, function (error) {
				console.log('Unable To Update Status');
				reject("Failed to validate query.");
			});
		});
	}

	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err) return reject(err);
				resolve();
			});
		});
	}
}

module.exports = Updates;