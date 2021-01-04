const nodemailer = require('nodemailer');

// used to email the user when they register for the first time
var confirm_email = function confirm_email(email, code) {

	// email config
	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		auth: {
			user: process.env.smtp,
			pass: process.env.password
		}
	});

	return new Promise ( (resolve, reject) => {
		if (!email || email == undefined || !code || code == undefined)
			reject ("No valid email given.");

		var mailOptions = {
			from: process.env.smtp,
			to: `${email}`,
			subject: 'Email Confirmation',
			text: `Please verify your email using this link: http://localhost:3306/${code}`
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) reject(error);
			resolve(info.response);
		});
	});
}

// used to email the user a reset link when the user forgets their password
var password_reset_link = function password_reset_link(email, code) {

	// email config
	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		auth: {
			user: process.env.smtp,
			pass: process.env.password
		}
	});

	return new Promise ( (resolve, reject) => {
		if (!email || email == undefined || !code || code == undefined)
			reject ("No valid email given.");

		var mailOptions = {
			from: process.env.smtp,
			to: `${email}`,
			subject: 'Password Reset Link',
			text: `Your password reset link: http://localhost:3306/${code}`
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) reject(error);
			resolve(info.response);
		});
	});
}

var updatedEmailLink = function updatedEmailLink(email, code) {

	// email config
	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		auth: {
			user: process.env.smtp,
			pass: process.env.password
		}
	});

	return new Promise ( (resolve, reject) => {
		if (!email || email == undefined || !code || code == undefined)
			reject ("No valid email given.");

		var mailOptions = {
			from: process.env.smtp,
			to: `${email}`,
			subject: 'Updated Email Link',
			text: `Your password reset link: http://localhost:3306/check/${code}`
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) reject(error);
			resolve(info.response);
		});
	});
}

module.exports.confirm_email = confirm_email;
module.exports.password_reset_link = password_reset_link;
module.exports.updatedEmailLink = updatedEmailLink;