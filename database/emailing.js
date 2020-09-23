const nodemailer = require('nodemailer');

// email config
var transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: 'matchaccnts@gmail.com',
		pass: 'matcha2020WTC'
	}
});

var confirm_email = function confirm_email(email, code) {
	return new Promise ( (resolve, reject) => {
		if (!email || email == undefined || !code || code == undefined)
			reject ("No valid email given.");

		var mailOptions = {
			from: 'ftmatcha@gmail.com',
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

module.exports.confirm_email = confirm_email;