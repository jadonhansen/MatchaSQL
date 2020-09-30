const db = require('./config');
const mysql = require('mysql');

class Matches {

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

	renderMatchedUser(currUser, matched) {
		return new Promise((resolve, reject) => {
			let match = this.getMatchedUser(matched);
			let a = this;

			match.then(function (usr) {
				let connect = a.determineConnectivity(currUser, usr.username);

				connect.then(function (connectVal) {
					let sql = "SELECT * FROM views WHERE viewed = ? AND viewer = ?";
					let inserts = [usr.username, currUser];
					sql = mysql.format(sql, inserts);
					let viewed = a.query(sql);

					viewed.then(function (ret) {
						if (!ret[0]) a.increaseView(currUser, usr.username);
						a.viewNotification(usr.username, currUser);

						usr.connected = connectVal.c;
						usr.liked = connectVal.l;

						let tags = a.getUserTags(usr.username);

						tags.then(function (tagsArr) {
							if (tagsArr) usr.tags = tagsArr;
							resolve(usr);
						});
					}, function (err) {
						console.log('Unable To Add View');
						reject(err);
					});
				}, function (err) {
					console.log('Unable To Determine Connectivity');
					reject(err);
				});
			}, function (err) {
				console.log('Unable To Get Matched User');
				reject(err);
			});
		});
	}

	getMatchedUser(id) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT * FROM users WHERE userID = ?";
			let inserts = [id];
			sql = mysql.format(sql, inserts);
			let user = this.query(sql);

			user.then(function (ret) {
				if (ret[0]) {
					console.log('Fetched Matched User');
					resolve(ret[0]);
				}
				else reject('Unable To Fetch Matched User');
			}, function (err) {
				console.log('Unable To Fetch Matched User');
				reject("Failed to validate query.");
			});
		});	
	}

	determineConnectivity(currUser, matched) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM likes WHERE liked = ? AND liker = ?";
			let inserts = [matched, currUser];
			sql = mysql.format(sql, inserts);
			let liked = this.query(sql);
			let a  = this;

			let l = 0;
			let c = 0;
			liked.then(function (like) {
				if (like[0]) {
					l = 1;

					let sql = "SELECT * FROM likes WHERE liked = ? AND liker = ?";
					let inserts = [currUser, matched];
					sql = mysql.format(sql, inserts);
					let connect = a.query(sql);
	
					connect.then(function (conn) {
						if (conn[0]) c = 1;
						resolve({'l' : l, 'c' : c});
					});
				} else {
					resolve({'l' : l, 'c' : c});
				}
			}, function (err) {
				reject('Unable To Select Like')
			});
		});
	}

	// only generate view notif when user not in blocked list
	viewNotification(matched, currUser) {
		let sql = "SELECT * FROM blocks WHERE blocker = ? AND blocked = ?";
		let inserts = [matched, currUser];
		sql = mysql.format(sql, inserts);
		let outcome = this.query(sql);
		let a = this;

		outcome.then(function (blocks) {
			if (!blocks[0]) {
				let sql = "INSERT INTO notifications (username, name, content, timeNotif, readNotif) VALUES (?, ?, ?, ?, ?)";
				let roughDate = new Date();
				let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
				let str = currUser + ' viewed your profile';
				let inserts = [matched, 'profile view', str, newDate, 0];
				sql = mysql.format(sql, inserts);
				let notif = a.query(sql);
		
				notif.then(function (ret) {
					console.log('Added View Notification');
				}, function (err) {
					console.log('Unable To Add View Notification');
				});
			}
		});
	}


	increaseView(currUser, matched) {
		let sql = "INSERT INTO views (viewed, viewer) VALUES (?, ?)";
		let inserts = [matched, currUser];
		sql = mysql.format(sql, inserts);
		let vd = this.query(sql);

		vd.then(function (success) {
			console.log('Inserted View');
		}, function (err) {
			console.log('Unable To Insert View: ', err);
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
				reject('Unable To Select All Tags');
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

module.exports = Matches;