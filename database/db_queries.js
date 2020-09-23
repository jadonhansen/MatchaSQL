const db = require('./config');
const mysql = require('mysql');
const email_handler = require('../database/emailing');
const encrypt = require('./crypting');

class Database {

	constructor() {
		this.connection = mysql.createConnection({
			host: `${db.servername}`,
			user: `${db.dbusername}`,
			database: `${db.dbname}`
		});
	}

	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows) => {
				if (err)
					return reject(err);
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

				user.then(function (res) {
					if (res[0].isverified == 1) {
						let pass = res[0];
						let password_check = encrypt.comparePassword(password, pass.password);
						
						password_check.then(function (res) {
							resolve(`Logged in user '${username}'`);
						}, function (err) {
							reject(`Incorrect password for '${username}'`);
						});
					} else {
						reject(`Please confirm your email with the link sent to continue.`)
					}
				});
			}, function (err) {
				reject(`'${username}' does not exist.`);
			});
		});
	}

	// Registering user
	register(username, name, surname, email, userPass, age, gender, prefferances) {
		return new Promise((resolve, reject) => {
			var a = this;
			let userExists = this.validate_user(username);

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
						}, function (err) {
							console.log('Error during registration: ', err);
						});
						return resolve();
					});
				});
		});
	}

	// Emailing user verif email
	email_user(username) {
		var a = this;
		let valid_user = this.validate_user(username);

		valid_user.then(function (data) {
			let user = a.get_user(username);

			user.then(function (data) {
				let confirmation = email_handler.confirm_email(data[0].email, data[0].verif);
				confirmation.then(function (ret) {
					console.log('Confirmation Email Sent.');
				}, function (err) {
					reject (err);
				});
			}, function (err) {
				reject (err);
			});
		}, function (err) {
			reject (err);
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

	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err)
					return reject(err);
				resolve();
			});
		});
	}
}

module.exports = Database;