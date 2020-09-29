const db = require('./config');
const mysql = require('mysql');

class Options {

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

	// decrement fame
	// remove both liked and like by user
	// render user, tags and 0 for like and conn
	blockUser(id, currUser) {
		return new Promise((resolve, reject) => {
			let sql = "UPDATE users SET fame = fame - 1 WHERE userID = ?";
			let inserts = [id];
			sql = mysql.format(sql, inserts);
			let updatedUsr = this.query(sql);
			let a  = this;

			let usr = this.getMatchedUser(id);
			usr.then(function (matched) {

				let del = a.deleteLikes(matched.username, currUser);
				del.then(function (success) {

					let block = a.addBlockedUser(matched.username, currUser);
					block.then(function (succ) {

						let tags = a.getUserTags(matched.username);
						tags.then(function (tagsArr) {
	
							matched.tags = tagsArr;
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
			}, function (err) {
				reject(err);
			});
		});
	}

	// create report record
	// determine connectivity
	// return user, taggs, conn state
	reportUser(id, currUser, message) {
		return new Promise((resolve, reject) => {

			let usr = this.getMatchedUser(id);
			let a = this;

			usr.then(function (matched) {
				if (matched) {
					let sql = "INSERT INTO reports (reported, reporter, message) VALUES(?, ?, ?)";
					let inserts = [matched.username, currUser, message];
					sql = mysql.format(sql, inserts);
					let report = a.query(sql);

					report.then(function (success) {
						let conn = a.determineConnectivity(currUser, matched.username);

						conn.then(function (connect) {
							let tags = a.getUserTags(currUser);

							tags.then(function (tagsArr) {
								matched.connected = connect.c;
								matched.liked = connect.l;
								matched.tags = tagsArr;
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
				}
				else reject('Unable to Fetch User');
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

	addBlockedUser(matched, currUser) {
		return new Promise((resolve, reject) => {
			let sql = "INSERT INTO blocks (blocker, blocked) VALUES (?, ?)";
			let inserts = [currUser, matched];
			sql = mysql.format(sql, inserts);
			let block = this.query(sql);

			block.then(function (success) {
				console.log('Blocked User Succesfully');
				resolve();
			}, function (err) {
				reject('Unable To Block User');
			});
		});
	}

	deleteLikes(matched, currUser) {
		return new Promise((resolve, reject) => {
			let sql = "DELETE FROM likes WHERE liked = ? AND liker = ?";
			let inserts = [matched, currUser];
			sql = mysql.format(sql, inserts);
			let del = this.query(sql);

			del.then(function (success) {
				console.log('Deleted Liked Record');
				resolve();
			}, function (err) {
				reject('Unable To Delete Liked Record');
			});

			let sqll = "DELETE FROM likes WHERE liked = ? AND liker = ?";
			let insertss = [currUser, matched];
			sqll = mysql.format(sqll, insertss);
			let delet = this.query(sqll);

			delet.then(function (success) {
				console.log('Deleted Like Record');
				resolve();
			}, function (err) {
				reject('Unable To Delete Like Record');
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
				console.log('Selected All Tags: ', arr);
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

module.exports = Options;