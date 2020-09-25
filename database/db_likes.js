const db = require('./config');
const mysql = require('mysql');

class Likes {

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

	likeUser(id, currUser) {
		// find user by id
		// increment fame of id
		// add user into curruser likes
		// remove user from curruser blocked list if blocked
		// determine if user has liked back - if yes = connected
		// do new like notification
		// return user info && tags && connected
		return new Promise((resolve, reject) => {
			let sql = "UPDATE users SET fame = fame + 1 WHERE userID = ?";
			let inserts = [id];
			sql = mysql.format(sql, inserts);
			let user = this.query(sql);

			let usr = this.getMatchedUser(id);
			let a = this;

			usr.then(function (matched) {

				let sql = "INSERT INTO likes (liked, liker) VALUES(?, ?)";
				let inserts = [matched.username, currUser];
				sql = mysql.format(sql, inserts);
				let inserted = a.query(sql);

				inserted.then(function (success) {
					a.likedNotification(matched.username, currUser);

					let sql = "DELETE FROM blocks WHERE blocked = ? AND blocker = ?";
					let inserts = [matched.username, currUser];
					sql = mysql.format(sql, inserts);
					let del = a.query(sql);

					del.then(function (success) {
						
						let sql = "SELECT liker FROM likes WHERE liked = ?";
						let inserts = [currUser];
						sql = mysql.format(sql, inserts);
						let likedUsr = a.query(sql);

						likedUsr.then(function (retUser) {
							let connected = 0;
							if (retUser[0] && retUser[0] == matched.username) connected = 1;

							let tags = a.getUserTags(matched.username);

							tags.then(function (tagsArr) {
								matched.tags = tagsArr;
								matched.connected = connected});
								resolve(matched);
							});
						});
					});
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
				console.log('Fetched Matched User');
				resolve(ret[0]);
			}, function (err) {
				console.log('Unable To Fetch Matched User');
				reject("Failed to validate query.");
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
				console.log('Selected All Tags: ', ret);
				resolve(ret);
			}, function (err) {
				reject('Unable To Select All Tags');
			});
		});
	}

	likedNotification(matched, currUser) {
		let sql = "INSERT INTO notifications (username, name, content, timeNotif, readNotif) VALUES (?, ?, ?, ?, ?)";
		let roughDate = new Date();
		let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
		let inserts = [matched, 'liked', 'you where just liked by ' + currUser, newDate, 0];
		sql = mysql.format(sql, inserts);
		let notif = this.query(sql);

		notif.then(function (ret) {
			console.log('Added Like Notification');
		}, function (err) {
			console.log('Unable To Add Like Notification');
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

	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err) return reject(err);
				resolve();
			});
		});
	}
}

module.exports = Likes;