const db = require('./config');
const mysql = require('mysql');

class Unlikes {

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

	// find user by id
	// decrement fame of id
	// remove user from curruser likes
	// do new unlike notification
	// send back 0 for conn and 0 for like
	// return user info && tags && connected
	unlikeUser(id, currUser) {
		return new Promise((resolve, reject) => {
			let sql = "UPDATE users SET fame = fame - 1 WHERE userID = ?";
			let inserts = [id];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);

			let usr = this.getMatchedUser(id);
			let a = this;

			usr.then(function (matched) {
				let sql = "DELETE FROM likes WHERE liked = ? AND liker = ?";
				let inserts = [matched.username, currUser];
				sql = mysql.format(sql, inserts);
				let deleted = a.query(sql);

				deleted.then (function (success) {
					a.unlikedNotification(matched.username, currUser);

					let tags = a.getUserTags(matched.username);

					tags.then(function (tagArr) {
						matched.tags = tagArr;
						matched.liked = 0;
						matched.connected = 0;
						resolve(matched);
					}, function (err) {
						reject(err);
					});
				}, function (err) {
					reject(err);
				});
			}, function (err) {
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
				reject('Unable To Fetch Matched User');
			});
		});	
	}

	// returns user tags
	getUserTags(username) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT tag FROM tags WHERE user = ?";
			let inserts = [username];
			sql = mysql.format(sql, inserts);
			let tags = this.query(sql);

			tags.then(function (ret) {
				let arr = new Array();
				ret.forEach(element => {
					arr.push(element.tag);
				});
				console.log('Selected All Tags: ', arr);
				resolve(arr);
			}, function (err) {
				reject('Unable To Select All Tags');
			});
		});
	}

	// only generate unlike notif when user not in blocked list
	unlikedNotification(matched, currUser) {
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
				let inserts = [matched, 'unliked', 'you were just unliked by ' + currUser, newDate, 0];
				sql = mysql.format(sql, inserts);
				let notif = a.query(sql);
		
				notif.then(function (ret) {
					console.log('Added Unlike Notification');
				}, function (err) {
					console.log('Unable To Add Unlike Notification');
				});
			}
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

module.exports = Unlikes;