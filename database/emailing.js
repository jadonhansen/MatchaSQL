const nodemailer = require('nodemailer');

// emailer
let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'ftmatcha@gmail.com',
		pass: 'qwerty0308'
	}
});

var confirm_email = function confirm_email(email, code) {
	return new Promise ( (resolve, reject) => {
		if (!email || email == undefined)
			reject ("No valid email given.");

		var mailOptions = {
			from: 'ftmatcha@gmail.com',
			to: `${email}`,
			subject: 'Email Confirmation',
			text: `Please verify your email using this link: http://localhost:777/${code}`
		};
		
		transporter.sendMail(mailOptions, function(error, info) {
			if (error)
				reject(error);
			else
				resolve(info.response);
		});
	});
}

module.exports.confirm_email = confirm_email;