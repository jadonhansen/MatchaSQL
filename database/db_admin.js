const db = require('./config');
const mysql = require('mysql');
const encrypt = require('./crypting');

class Admin {

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

	isAdmin(username) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM admin WHERE username = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let usr = this.query(sql);

			usr.then(function (user) {
				if (user[0]) resolve(user[0]);
				else reject('Not Found!')
			}, function (err) {
				reject('Unable To Select User');
			});
		});	
	}

	isAdminLogin(username, password) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM admin WHERE username = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let usr = this.query(sql);

			usr.then(function (user) {
				if (user[0]) {

					let password_check = encrypt.comparePassword(password, user[0].password);
					password_check.then(function (ress) {
						resolve(user[0]);
					}, function (err) {
						reject(`Incorrect password`);
					});
				}
				else reject('Not Found!')
			}, function (err) {
				reject('Unable To Select User');
			});
		});	
	}

	getBlockAndReports() {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM blocks";
			let outcome = this.query(sql);
			let a = this;

			outcome.then(function (blocks) {

				let sql = "SELECT * FROM reports";
				let outcm = a.query(sql);

				outcm.then(function (reports) {
					let data = new Object;
					data.reports = reports;
					data.blocks = blocks;
					resolve(data);
				}, function (err) {
					reject('Unable To Select Reports');
				});
			}, function (err) {
				reject('Unable To Select Blocks');
			});
		});
	}

	delReport(username) {
		return new Promise((resolve, reject) => {
			let sql = "DELETE FROM reports WHERE reported = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let usr = this.query(sql);

			usr.then(function (success) {
				resolve();
			}, function (err) {
				reject('Unable To Delete Report');
			});
		});
	}

	delBlock(username) {
		return new Promise((resolve, reject) => {
			let sql = "DELETE FROM blocks WHERE blocked = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let usr = this.query(sql);

			usr.then(function (success) {
				resolve();
			}, function (err) {
				reject('Unable To Delete Blocked Record');
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

module.exports = Admin;