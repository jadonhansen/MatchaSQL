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

	// find user by id
	// increment fame of id
	// add user into curruser likes
	// remove user from curruser blocked list if blocked
	// determine if user has liked back - if yes = connected
	// do new like notification
	// return user info && tags && connected
	likeUser(id, currUser) {
		return new Promise((resolve, reject) => {
			let sql = "UPDATE users SET fame = fame + 1 WHERE userID = ?";
			let inserts = [id];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);

			let usr = this.getMatchedUser(id);
			let a = this;

			usr.then(function (matched) {

				let sql = "INSERT INTO likes (liked, liker) VALUES(?, ?)";
				let inserts = [matched.username, currUser];
				sql = mysql.format(sql, inserts);
				let inserted = a.query(sql);

				inserted.then(function (success) {
					a.likedNotification(matched.username, currUser);

					let sqll = "DELETE FROM blocks WHERE blocked = ? AND blocker = ?";
					let insertss = [matched.username, currUser];
					sqll = mysql.format(sqll, insertss);
					let del = a.query(sqll);

					del.then(function (success) {

						let conn = a.determineConnectivity(currUser, matched.username);
						conn.then(function (connect) {

							let tags = a.getUserTags(matched.username);
							tags.then(function (tagsArr) {

								matched.tags = tagsArr;
								matched.liked = 1;
								matched.connected = connect.c;
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

	// only generate like notif when user not in blocked list
	likedNotification(matched, currUser) {
		let sql = "SELECT * FROM blocks WHERE blocker = ? AND blocked = ?";
		let inserts = [matched, currUser];
		sql = mysql.format(sql, inserts);
		let outcome = this.query(sql);
		let a = this;

		outcome.then(function (blocks) {
			if (!blocks[0]) {

				let sql = "SELECT * FROM likes WHERE liker = ? AND liked = ?";
				let inserts = [matched, currUser];
				sql = mysql.format(sql, inserts);
				let usr = a.query(sql);

				usr.then(function (user) {
					if (user[0]) a.likeBackNotif(matched, currUser);
					else {
						let sql = "INSERT INTO notifications (username, name, content, timeNotif, readNotif) VALUES (?, ?, ?, ?, ?)";
						let roughDate = new Date();
						let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
						let inserts = [matched, 'liked', 'you were just liked by ' + currUser, newDate, 0];
						sql = mysql.format(sql, inserts);
						let notif = a.query(sql);
				
						notif.then(function (ret) {
							console.log('Added Like Notification');
						}, function (err) {
							console.log('Unable To Add Like Notification');
						});
					}
				}, function (err) {
					console.log('Unable To Search For Liked User: ', err);
				});
			}
		});
	}

	likeBackNotif(matched, currUser) {
		let sql = "INSERT INTO notifications (username, name, content, timeNotif, readNotif) VALUES (?, ?, ?, ?, ?)";
		let roughDate = new Date();
		let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
		let inserts = [matched, 'liked back', 'you were just liked back by ' + currUser, newDate, 0];
		sql = mysql.format(sql, inserts);
		let notif = this.query(sql);

		notif.then(function (ret) {
			console.log('Added Liked Back Notification');
		}, function (err) {
			console.log('Unable To Add Liked Back Notification');
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