const mysql = require('mysql');
const db = require('./config');
const Database = require('./db_queries');

var DB = new Database();

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
						name LONGTEXT NOT NULL,
						surname LONGTEXT NOT NULL,
						gender LONGTEXT NOT NULL,
						main_image LONGTEXT,
						image_one LONGTEXT,
						image_two LONGTEXT,
						image_three LONGTEXT,
						image_four LONGTEXT,
						age int(11) NOT NULL,
						prefferances LONGTEXT NOT NULL,
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
						else {
							// Male users
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("jhansen", "jadongavhansen@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Jadon", "Hansen", "Male", 20, "Female", "Surfer dude 4 life", "Cape Town", 1, 0, 1)`);
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("cdiogo", "calvinogo@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Calvin", "Diogo", "Male", 22, "Female", "Race car driver :)", "Cape Town", 1, 0, 1)`);

							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("jlimbada", "jfflim@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Jeff", "Limbada", "Male", 21, "Male", "Programmer", "Cape Town", 1, 0, 1)`);
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("ayano", "ayano@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Arata", "Yano", "Male", 23, "Male", "Imposter Syndrome", "Cape Town", 1, 0, 1)`);

							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("bwebb", "bwebb@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Ben", "Webb", "Male", 20, "Bi-Sexual", "Wannabe Surfer", "Cape Town", 1, 0, 1)`);
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("lkriel", "kriel@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Liam", "Krieling", "Male", 19, "Bi-Sexual", "Strange MF", "Cape Town", 1, 0, 1)`);

							// Female users
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("trisha", "trish@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Trish", "Alaking", "Female", 21, "Male", "hi", "Cape Town", 1, 0, 1)`);
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("carlayeng", "yengdeng@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Carla", "Yeng", "Female", 24, "Male", "yoooo whassup", "Cape Town", 1, 0, 1)`);

							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("ginnna", "gina@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Gina", "Nina", "Female", 23, "Female", "generic sh*t", "Cape Town", 1, 0, 1)`);
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("kitty", "kit@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Kitty", "Nemo", "Female", 28, "Female", "ayo ayo", "Cape Town", 1, 0, 1)`);

							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("sparkly", "spark@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Spark", "Shark", "Female", 25, "Bi-Sexual", "rainbows pls", "Cape Town", 1, 0, 1)`);
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("candizz", "candice@gmail.com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Candice", "Lemont", "Female", 27, "Bi-Sexual", "food", "Cape Town", 1, 0, 1)`);

							// Other users
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("heartly", "lerom@gmail,com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Lerom", "Centa", "Other", 26, "Male", "new things", "Cape Town", 1, 0, 1)`);
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("simone", "simon@gmail,com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Simone", "Tesla", "Other", 21, "Male", "gadgetyyy", "Cape Town", 1, 0, 1)`);

							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("romania", "roman@gmail,com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Romania", "Retricia", "Other", 29, "Female", "trendyy", "Cape Town", 1, 0, 1)`);
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("lucass", "lucas@gmail,com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Lucase", "Gerard", "Other", 20, "Female", "horses 4 life", "Cape Town", 1, 0, 1)`);

							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("leroma", "lerom@gmail,com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Lerome", "Stjui", "Other", 19, "Bi-Sexual", "candy stores 'r life", "Cape Town", 1, 0, 1)`);
							DB.query(`INSERT INTO users (username, email, password, name, surname, gender, age, prefferances, bio, location, location_status, fame, isverified)
							VALUES ("schen", "schenn@gmail,com", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu", "Schen", "Zintju", "Other", 28, "Bi-Sexual", "big city life", "Cape Town", 1, 0, 1)`);

							console.log('Created user table');
						}
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
					else {
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "jhansen")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "cdiogo")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "jlimbada")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "ayano")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "bwebb")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "lkriel")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "trisha")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "carlayeng")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "ginnna")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "kitty")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "sparkly")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "candizz")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "heartly")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "simone")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "romania")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "lucass")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "leroma")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("matcha", "schen")`);

						DB.query(`INSERT INTO tags (tag, user) VALUES ("surferdude", "jhansen")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("racedriver", "cdiogo")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("programmer", "jlimbada")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("post mortem", "ayano")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("boy bands", "bwebb")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("psycho", "lkriel")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("snacks", "trisha")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("good times", "carlayeng")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("bunnies", "ginnna")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("dogs", "kitty")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("bootcamp", "sparkly")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("veggies", "candizz")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("vegan", "heartly")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("animal lover", "simone")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("geography", "romania")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("science", "lucass")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("maths", "leroma")`);
						DB.query(`INSERT INTO tags (tag, user) VALUES ("coding", "schen")`);
					}
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
				console.log('Contacts Table Already Exists');
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

	// CREATE ADMIN TABLE

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
					AND table_name = 'admin'`,
		function (err, result) {
			if (err) throw err;

			if (result.length > 0) console.log('Admin Table Already Exists');
			else {
				var sql = `CREATE TABLE IF NOT EXISTS admin (
					username LONGTEXT NOT NULL,
					password LONGTEXT NOT NULL
					);`

				conn.query(sql, function (err, result) {
					if (err) throw err;
					else {
						// Admin user
						DB.query(`INSERT INTO admin (username, password) VALUES ("jadonhansen", "$2b$10$przJhQe.QRtGs6YpgtTNpuhagVKMWgQVxssyw0zVsRWH0bpwvxMsu")`);
						DB.close();
						console.log('Created admin table');
					}
				});
			}
		});
	});
}

module.exports.setupDB = setupDB;