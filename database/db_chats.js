const db = require('./config');
const mysql = require('mysql');

class Chats {

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

	renderChat(id) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT username, userID, email FROM users WHERE userID = ?";
			let inserts = [id];
			sql = mysql.format(sql, inserts);
			let usr = this.query(sql);

			usr.then(function (user) {
				if (user[0]) resolve(user[0]);
				else reject('Chatter ID Not Found!')
			}, function (err) {
				reject('Unable To Select Render Details');
			});
		});
	}

	getMessages(email, currUser) {
		return new Promise((resolve, reject) => {

			let usr = this.getByEmail(email);
			let a = this;
			usr.then(function (chatter) {

				let sql = "SELECT * FROM messages WHERE toUser = ? AND fromUser = ?";
				let inserts = [chatter.username, currUser];
				sql = mysql.format(sql, inserts);
				let sent = a.query(sql);
	
				sent.then(function (sentRet) {
					
					let sql = "SELECT * FROM messages WHERE toUser = ? AND fromUser = ?";
					let inserts = [currUser, chatter.username];
					sql = mysql.format(sql, inserts);
					let from = a.query(sql);

					from.then(function (fromRet) {
          				let msgArr = new Array(2);
						msgArr[0] = sentRet;
						msgArr[1] = fromRet;
						resolve(msgArr);
					}, function (err) {
						reject('Unable to Fetch "From" Messages');
					});
				}, function (err) {
					reject('Unable To Fetch "Sent" Messages');
				});
			}, function (err) {
				reject(err);
			});
		});
	}

	// find chatter by id
	// save message
	// create contact for both user (or one?)
	// create message notification
	sendMessage(id, currUser, message) {
		return new Promise((resolve, reject) => {

			let a = this;
			let usr = this.getById(id);
			usr.then(function (chatter) {

				let msg = a.saveMessage(chatter.username, currUser, message);
				msg.then(function (success) {

					let cont = a.saveContact(chatter.username, currUser);
					cont.then(function (ret) {

						let notif = a.messageNotif(chatter.username, currUser, message);
						notif.then(function (success) {
							resolve(chatter);
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

	saveMessage(chatter, currUser, msg) {
		return new Promise((resolve, reject) => {
			let roughDate = new Date();
          	let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
			let sql = "INSERT INTO messages (toUser, fromUser, message, readMsg, timeSent, sortTime) VALUES(?, ?, ?, ?, ?, ?)";
			let inserts = [chatter, currUser, msg, 0, newDate, roughDate.getTime()];
			sql = mysql.format(sql, inserts);
			let outcome = this.query(sql);

			outcome.then(function (res) {
				resolve();
			}, function (err) {
				reject('Could Not Save Message');
			});
		});
	}

	saveContact(chatter, currUser) {
		return new Promise((resolve, reject) => {
			let a = this;

			let sql = "SELECT * FROM contacts WHERE username = ? AND contact = ?"
			let inserts = [currUser, chatter];
			sql = mysql.format(sql, inserts);
			let outcome = this.query(sql);

			outcome.then(function (res) {
				if (!res[0]) {
					let sql = "INSERT INTO contacts (username, contact) VALUES(?, ?)";
					let inserts = [currUser, chatter];
					sql = mysql.format(sql, inserts);
					let outcome = a.query(sql);

					outcome.then(function (res) {

						let sql = "SELECT * FROM contacts WHERE username = ? AND contact = ?"
						let inserts = [chatter, currUser];
						sql = mysql.format(sql, inserts);
						let outcum = a.query(sql);

						outcum.then(function (res) {
							if (!res[0]) {
								let sql = "INSERT INTO contacts (username, contact) VALUES(?, ?)";
								let inserts = [chatter, currUser];
								sql = mysql.format(sql, inserts);
								let outcm = a.query(sql);
					
								outcm.then(function (ress) {
									resolve();
								}, function (err) {
									reject('Could Not Save Contact To Chatter');
								});
							}
						}, function (err) {
							reject('Could Not Select Current User');
						});
						
					}, function (err) {
						reject('Could Not Save Contact To Current User');
					});
				} else {
					let sql = "SELECT * FROM contacts WHERE username = ? AND contact = ?"
					let inserts = [chatter, currUser];
					sql = mysql.format(sql, inserts);
					let outcum = a.query(sql);

					outcum.then(function (res) {
						if (!res[0]) {
							let sql = "INSERT INTO contacts (username, contact) VALUES(?, ?)";
							let inserts = [chatter, currUser];
							sql = mysql.format(sql, inserts);
							let outcm = a.query(sql);
				
							outcm.then(function (ress) {
								resolve();
							}, function (err) {
								reject('Could Not Save Contact To Chatter');
							});
						}
						else resolve();
					});
				}
			}, function (err) {
				reject('Could Not Select Chatter');
			});
		});
	}

	messageNotif(chatter, currUser, message) {
		return new Promise((resolve, reject) => {
			let sql = "INSERT INTO notifications (username, name, content, timeNotif, readNotif) VALUES (?, ?, ?, ?, ?)";
			let roughDate = new Date();
			let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
			let inserts = [chatter, 'new message from ' + currUser, message, newDate, 0];
			sql = mysql.format(sql, inserts);
			let notif = this.query(sql);
	
			notif.then(function (ret) {
				console.log('Added Message Notification');
				resolve();
			}, function (err) {
				reject('Unable To Add Message Notification');
			});
		});
	}

	getById(id) {
		return new Promise((resolve, reject) => {
			let sql = "SELECT username, userID, email FROM users WHERE userID = ?";
			let inserts = [id];
			sql = mysql.format(sql, inserts);
			let user = this.query(sql);

			user.then(function (ret) {
				if (ret[0]) {
					console.log('Fetched Chatter');
					resolve(ret[0]);
				}
				else reject('Unable To Fetch Chatter 1.2');
			}, function (err) {
				console.log('Unable To Fetch Chatter 1.1');
				reject('Unable To Fetch Chatter 1.1');
			});
		});
	}

	getByEmail(email) {
		return new Promise((resolve, reject) => {

			let sql = "SELECT * FROM users WHERE email = ?";
			let inserts = [email];
			sql = mysql.format(sql, inserts);
			let user = this.query(sql);

			user.then(function (ret) {
				if (ret[0]) {
					console.log('Fetched Chatter');
					resolve(ret[0]);
				}
				else reject('Unable To Fetch Chatter 2.2');
			}, function (err) {
				console.log('Unable To Fetch Chatter 2.1');
				reject('Unable To Fetch Chatter 2.1');
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

module.exports = Chats;