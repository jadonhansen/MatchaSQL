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

			let sql = "SELECT gender, fame, location, prefferances, age, bio, email, username, main_image, userID FROM users";
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

			usr.then(function (matched) {

				let sql = "INSERT INTO likes (liked, liker) VALUES(?, ?)";
				let inserts = [matched.username, currUser];
				sql = mysql.format(sql, inserts);
				let inserted = this.query(sql);

				inserted.then(function (success) {
					this.likedNotification(matched.username, currUser);

					let sql = "DELETE FROM blocks WHERE blocked = ? AND blocker = ?";
					let inserts = [matched.username, currUser];
					sql = mysql.format(sql, inserts);
					let del = this.query(sql);

					del.then(function (success) {
						
						let sql = "SELECT liker FROM likes WHERE liked = ?";
						let inserts = [currUser];
						sql = mysql.format(sql, inserts);
						let likedUsr = this.query(sql);

						likedUsr.then(function (retUser) {
							let connected = 0;
							if (retUser[0] && retUser[0] == matched.username) connected = 1;

							let tags = this.getUserTags(matched.username);

							tags.then(function (tagsArr) {
								matched.push(tagsArr);
								matched.push({'connected' : connected});
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

	viewNotification(matched, currUser) {
		let sql = "INSERT INTO notifications (username, name, content, timeNotif, readNotif) VALUES (?, ?, ?, ?, ?)";
		let roughDate = new Date();
		let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
		let str = currUser + ' viewed your profile';
		let inserts = [matched, 'profile view', str, newDate, 0];
		sql = mysql.format(sql, inserts);
		let notif = this.query(sql);

		notif.then(function (ret) {
			console.log('Added View Notification');
		}, function (err) {
			console.log('Unable To Add View Notification');
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

	determineConnectivity(currUser, matched) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM likes WHERE liked = ? AND liker = ?";
			let inserts = [matched, currUser];
			sql = mysql.format(sql, inserts);
			let liked = this.query(sql);
	
			let l = 0;
			let c = 0;
			liked.then(function (like) {
				if (like[0]) {
					l = 1;
	
					let sql = "SELECT * FROM likes WHERE liked = ? AND liker = ?";
					let inserts = [currUser, matched];
					sql = mysql.format(sql, inserts);
					let connect = this.query(sql);
	
					connect.then(function (conn) {
						if (conn[0]) c = 0;
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