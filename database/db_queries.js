const db = require('./config');
const mysql = require('mysql');
const email_handler = require('../database/emailing');
const encrypt = require('./crypting');
const crypto = require('crypto');

class Database {

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

	// Login user
	login(username, password) {
		return new Promise((resolve, reject) => {
			let result = this.validate_user(username);
			var a = this;

			result.then(function (res) {
				let sql = "SELECT * FROM users WHERE username = ?";
				let inserts = [username];
				sql = mysql.format(sql, inserts);
				let user = a.query(sql);

				user.then(function (ret) {
					if (ret[0].isverified == 1) {
						let pass = ret[0];
						let password_check = encrypt.comparePassword(password, pass.password);

						password_check.then(function (ress) {
							resolve(`Logging in user`);
						}, function (err) {
							reject(`Incorrect password`);
						});
					} else {
						reject(`Please confirm your email with the link sent to continue.`)
					}
				});
			}, function (err) {
				reject(`Username does not exist.`);
			});
		});
	}

	// Registering user
	register(username, name, surname, email, userPass, age, gender, prefferances) {
		return new Promise((resolve, reject) => {
			let userExists = this.validate_user(username);
			var a = this;

			userExists.then(function (ret) {
				reject("User already exists");
			},
				function (err) {
					let hash = encrypt.cryptPassword(userPass);

					hash.then(function (hashPass) {
						let sql = `INSERT INTO users (username, email, password, name, surname,
							age, gender, prefferances, fame, location_status, verif) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
						let current_date = new Date();
						let verif = crypto.createHash('md5').update(current_date + username).digest('hex');
						let inserts = [username, email, hashPass, name, surname, age, gender, prefferances, 0, 1, verif];
						sql = mysql.format(sql, inserts);
						let registered = a.query(sql);

						registered.then(function (data) {
							a.email_user(username);
						}, function (error) {
							console.log('Error sending email: ', error);
						});
						return resolve();
					});
				});
		});
	}

	// Emailing user verif email
	email_user(username) {
		let user = this.get_user(username);

		user.then(function (ret) {
			let confirmation = email_handler.confirm_email(ret[0].email, ret[0].verif);

			confirmation.then(function (res) {
				console.log('Confirmation Email Sent.');
			}, function (err) {
				console.log('Unable To Send Email: ', err);
			});
		}, function (error) {
			console.log('Could Not Find User: ', error);
		});
	}

	// Checking if account is verified
	verified(username) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM users WHERE username = ?"
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let verified = this.query(sql);

			verified.then(function (data) {
				if (data[0].isverified == 1)
					resolve();
				else
					reject(0);
			}, function (err) {
				reject(0);
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
				resolve(ret);
			}, function (err) {
				reject(err);
			});
		});
	}

	// Getting verified user by username
	get_valid_user(username) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM users WHERE username = ? AND isverified = ?";
			let inserts = [username, 1];
			sql = mysql.format(sql, inserts);
			let userExists = this.query(sql);

			userExists.then(function (ret) {
				if (!ret[0])
					return reject("User does not exist.");
				resolve(ret);
			}, function (err) {
				reject(err);
			});
		});
	}

	// Checking if user exists
	validate_user(username) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT * FROM users WHERE username = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let userExists = this.query(sql);

			userExists.then(function (ret) {
				if (ret[0])
					resolve(1);
				reject(0);
			}, function (err) {
				reject("Failed to validate query.");
			});
		});
	}

	// returns users tags
	getUserTags(username) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT * FROM tags WHERE user = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let tags = this.query(sql);

			tags.then(function (ret) {
				let arr = new Array();
				ret.forEach(element => {
					arr.push(element.tag);
				});
				resolve(arr);
			}, function (err) {
				reject("Failed to validate query.");
			});
		});
	}

	// returns the people who viewed the user
	getUserViews(username) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT * FROM views WHERE viewed = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let views = this.query(sql);

			views.then(function (ret) {
				let arr = new Array();
				ret.forEach(element => {
					arr.push(element.viewer);
				});
				resolve(arr);
			}, function (err) {
				reject("Failed to validate query.");
			});
		});
	}

	// returns the people who the user viewed
	getUserViewed(username) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT * FROM views WHERE viewer = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let viewd = this.query(sql);

			viewd.then(function (ret) {
				let arr = new Array();
				ret.forEach(element => {
					arr.push(element.viewed);
				});
				resolve(arr);
			}, function (err) {
				reject("Failed to validate query.");
			});
		});
	}

	// returns the people who liked the user
	getUserLikes(username) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT * FROM likes WHERE liked = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let userExists = this.query(sql);

			userExists.then(function (ret) {
				let arr = new Array;
				ret.forEach(element => {
					arr.push(element.liker);
				});
				resolve(arr);
			}, function (err) {
				reject("Failed to validate query.");
			});
		});
	}

	// returns the people who the user liked
	getUserLiked(username) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT * FROM likes WHERE liker = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let userExists = this.query(sql);

			userExists.then(function (ret) {
				let arr = new Array;
				ret.forEach(element => {
					arr.push(element.liked);
				});
				resolve(arr);
			}, function (err) {
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

module.exports = Database;