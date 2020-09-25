const db = require('./config');
const mysql = require('mysql');

class Searches {

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

	getUserTags(username) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT tag FROM tags WHERE user = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let tags = this.query(sql);

			tags.then(function (ret) {
				console.log('Selected All Tags: ', ret);
				resolve(ret);
			}, function (err) {
				reject('Unable To Select All Tags');
			});
		});
	}

	getUserSpecs(username) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT gender, fame, location, prefferances, age, email, username, userID FROM users WHERE username = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let user = this.query(sql);

			user.then(function (ret) {
				console.log('Selected User Specifics: ', ret[0]);
				resolve(ret[0]);
			}, function (err) {
				console.log('Unable To Select User Specifics');
				reject("Failed to validate query.");
			});
		});
	}

	getAllUsers() {
		return new Promise((resolve, reject) => {

			let sql = "SELECT gender, fame, location, prefferances, age, email, username, userID FROM users";
			let users = this.query(sql);

			users.then(function (ret) {
				console.log('Fetched All Users');
				resolve(ret);
			}, function (err) {
				console.log('Unable To Fetch Users');
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

module.exports = Searches;