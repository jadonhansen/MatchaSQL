const mysql = require('mysql');
const db = require('./config');

var setupDB = function setupDB() {
	var connection = mysql.createConnection({
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`
	});

	connection.connect(function(error) {

		if (error) throw(error);

		connection.query("CREATE DATABASE IF NOT EXISTS matcha", function (err, result) {
			if (err) throw(err);
			console.log('Initiliazed databse...');
			connection.end();
			setupTables();
		});
	});
}

var setupTables = function setupTables() {

	var conn = mysql.createConnection( {
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`,
		database: `${db.dbname}`
	});

	// CREATE USER TABLE

	conn.connect(function(error) {
		if (error) throw error;

		conn.query(`SELECT * FROM information_schema.tables
					WHERE table_schema = 'matcha'
					AND table_name = 'users'`,
			function (err, result) {

				if (err) throw err;

				if (result.length > 0) {
					console.log('User Table Already Exists');
				}
				else {
					var sql = `CREATE TABLE IF NOT EXISTS users (
						userID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
						username TINYTEXT NOT NULL,
						email LONGTEXT NOT NULL,
						password LONGTEXT NOT NULL,
						name LONGTEXT,
						surname LONGTEXT,
						gender LONGTEXT,
						main_image LONGTEXT,
						image_one LONGTEXT,
						image_two LONGTEXT,
						image_three LONGTEXT,
						image_four LONGTEXT,
						age int(11),
						prefferances LONGTEXT,
						bio LONGTEXT,
						location LONGTEXT,
						location_status int(11) default 1,
						fame int(11) default 0,
						isverified BOOLEAN default 0,
						verif_email LONGTEXT,
						verif LONGTEXT,
						status LONGTEXT
						);`

					conn.query(sql, function (erro, result) {
						if (erro) throw erro;
						console.log('Created user table');
					});
				}
		});
	});

	// CREATE MESSAGES TABLE

	var conn = mysql.createConnection( {
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`,
		database: `${db.dbname}`
	});

	conn.connect(function(err) {
		if (err) throw err;

		conn.query(`SELECT * FROM information_schema.tables
					WHERE table_schema = 'matcha'
					AND table_name = 'messages'`,
		function (err, result) {
			if (err) throw err;

			if (result.length > 0) {
				console.log('Messages Table Already Exists');
			}
			else {
				var sql = `CREATE TABLE IF NOT EXISTS messages (
					toUser LONGTEXT NOT NULL,
					fromUser LONGTEXT NOT NULL,
					message LONGTEXT NOT NULL,
					readMsg BOOLEAN DEFAULT 0,
					timeSent LONGTEXT NOT NULL,
					sortTime bigint(13) NOT NULL
					);`

				conn.query(sql, function (err, result) {
					if (err) throw err;
					console.log('Created messages table');
				});
			}
		});
	});

	// CREATE LIKES TABLE

	var conn = mysql.createConnection( {
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`,
		database: `${db.dbname}`
	});

	conn.connect(function(err) {
		if (err) throw err;

		conn.query(`SELECT * FROM information_schema.tables
					WHERE table_schema = 'matcha'
					AND table_name = 'likes'`,
		function (err, result) {
			if (err) throw err;

			if (result.length > 0) {
				console.log('Images Table Already Exists');
			}
			else {
				var sql = `CREATE TABLE IF NOT EXISTS likes (
					liked LONGTEXT NOT NULL,
					liker LONGTEXT NOT NULL
					);`

				conn.query(sql, function (err, result) {
					if (err) throw err;
					console.log('Created likes table');
				});
			}
		});
	});

	// CREATE VIEWS TABLE

	var conn = mysql.createConnection( {
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`,
		database: `${db.dbname}`
	});

	conn.connect(function(err) {
		if (err) throw err;

		conn.query(`SELECT * FROM information_schema.tables
					WHERE table_schema = 'matcha'
					AND table_name = 'views'`,
		function (err, result) {
			if (err) throw err;

			if (result.length > 0) {
				console.log('Images Table Already Exists');
			}
			else {
				var sql = `CREATE TABLE IF NOT EXISTS views (
					viewed LONGTEXT,
					viewer LONGTEXT
					);`

				conn.query(sql, function (err, result) {
					if (err) throw err;
					console.log('Created views table');
				});
			}
		});
	});

	// CREATE TAGS TABLE

	var conn = mysql.createConnection( {
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`,
		database: `${db.dbname}`
	});

	conn.connect(function(err) {
		if (err) throw err;

		conn.query(`SELECT * FROM information_schema.tables
					WHERE table_schema = 'matcha'
					AND table_name = 'tags'`,
		function (err, result) {
			if (err) throw err;

			if (result.length > 0) {
				console.log('Tags Table Already Exists');
			}
			else {
				var sql = `CREATE TABLE IF NOT EXISTS tags (
					tag varchar(50) NOT NULL,
					user TINYTEXT NOT NULL
					);`

				conn.query(sql, function (err, result) {
					if (err) throw err;
					console.log('Created tags table');
				});
			}
		});
	});

	// CREATE BLOCKS TABLE

	var conn = mysql.createConnection( {
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`,
		database: `${db.dbname}`
	});

	conn.connect(function(err) {
		if (err) throw err;

		conn.query(`SELECT * FROM information_schema.tables
					WHERE table_schema = 'matcha'
					AND table_name = 'blocks'`,
		function (err, result) {
			if (err) throw err;

			if (result.length > 0) {
				console.log('Blocks Table Already Exists');
			}
			else {
				var sql = `CREATE TABLE IF NOT EXISTS blocks (
					blocker LONGTEXT,
					blocked LONGTEXT
					);`

				conn.query(sql, function (err, result) {
					if (err) throw err;
					console.log('Created blocks table');
				});
			}
		});
	});

	// CREATE REPORTS TABLE

	var conn = mysql.createConnection( {
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`,
		database: `${db.dbname}`
	});

	conn.connect(function(err) {
		if (err) throw err;

		conn.query(`SELECT * FROM information_schema.tables
					WHERE table_schema = 'matcha'
					AND table_name = 'reports'`,
		function (err, result) {
			if (err) throw err;

			if (result.length > 0) {
				console.log('Reports Table Already Exists');
			}
			else {
				var sql = `CREATE TABLE IF NOT EXISTS reports (
					reported LONGTEXT,
					reporter LONGTEXT,
					message LONGTEXT
					);`

				conn.query(sql, function (err, result) {
					if (err) throw err;
					console.log('Created reports table');
				});
			}
		});
	});

	// CREATE NOTIFICATIONS TABLE

	var conn = mysql.createConnection( {
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`,
		database: `${db.dbname}`
	});
	
	conn.connect(function(err) {
		if (err) throw err;

		conn.query(`SELECT * FROM information_schema.tables
					WHERE table_schema = 'matcha'
					AND table_name = 'notifications'`,
		function (err, result) {
			if (err) throw err;

			if (result.length > 0) {
				console.log('Notifications Table Already Exists');
			}
			else {
				var sql = `CREATE TABLE IF NOT EXISTS notifications (
					msgID int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
					username LONGTEXT NOT NULL,
					name varchar(30) NOT NULL,
					content LONGTEXT NOT NULL,
					timeNotif LONGTEXT NOT NULL,
					readNotif BOOLEAN default 0
					);`

				conn.query(sql, function (err, result) {
					if (err) throw err;
					console.log('Created notifications table');
				});
			}
		});
	});

	// CREATE CONTACTS TABLE

	var conn = mysql.createConnection( {
		host: `${db.servername}`,
		user: `${db.dbusername}`,
		password: `${db.dbpassword}`,
		port: `${db.dbport}`,
		database: `${db.dbname}`
	});

	conn.connect(function(err) {
		if (err) throw err;

		conn.query(`SELECT * FROM information_schema.tables
					WHERE table_schema = 'matcha'
					AND table_name = 'contacts'`,
		function (err, result) {
			if (err) throw err;

			if (result.length > 0) {
				console.log('Notifications Table Already Exists');
			}
			else {
				var sql = `CREATE TABLE IF NOT EXISTS contacts (
					username LONGTEXT NOT NULL,
					contact LONGTEXT NOT NULL
					);`

				conn.query(sql, function (err, result) {
					if (err) throw err;
					console.log('Created contacts table');
				});
			}
		});
	});
}

module.exports.setupDB = setupDB;