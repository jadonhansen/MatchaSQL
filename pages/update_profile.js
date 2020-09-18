var express = require('express');
var router = express.Router();
var Models = require('../models/models');
const bodyParser = require('body-parser');
var crypto = require('crypto');
var randomstring = require('randomstring');
var nodeMailer = require('nodemailer');

function passwordCheck(password) {
    if (password.length >= 8) {
        if (password.includes(' ') || password.includes('\t') || password.includes('\n') || password.includes('\s')) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}

router.post('/update_password', bodyParser.urlencoded({extended: true}), function(req, res){
    if(!req.session.name) {
        res.render('oops', {error: '2'});
    }
    else {
        if (req.body.pass && req.body.repeat_pass && req.body.pass == req.body.repeat_pass) {
            if (passwordCheck(req.body.pass)) {
                const pass = crypto.pbkdf2Sync(req.body.pass, '100', 1000, 64, `sha512`).toString(`hex`);
                Models.user.findOneAndUpdate({ email : req.session.name }, { 'password' : pass }, function(err, _update) {
                    console.log('updated password - profile update');
                    res.redirect('/profile');
                });
            } else {
                res.render('oops', {error: '13'});
            }
        } else {
            res.render('oops', {error: '8'});
        }
    }
});

router.post('/update_email', bodyParser.urlencoded({extended: true}), function(req, res){
    if(!req.session.name) {
        return(res.render('oops', {error: '2'}));
    }
    else if (req.body.email)
    {
        Models.user.findOne({email : req.body.email}, { email : 1 }, function(err, yes){
            if (err) {
                console.log('Error finding User  - email profile update: ', err);
                res.render('oops', {error: '3'});
            }
            else if (yes) {
                console.log('existing user found - profile email update');
                res.render('oops', {error: '9'});
            } else if (yes == null) {
                var safe = crypto.pbkdf2Sync(randomstring.generate(), '100' ,1000, 64, `sha512`).toString(`hex`);
                console.log(req.body.email);
                Models.user.findOneAndUpdate({ email : req.session.name }, { $set : {'verif' : safe, 'verif_email' : req.body.email}}, function(err, _update) {
                    if (err) {
                        console.log('unable to set verif - profile update: ', err);
                        res.render('oops', {error: '3'});
                    } else {
                        console.log('set new verif - profile update');
                        let transporter = nodeMailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'ftmatcha@gmail.com',
                                pass: process.env.password
                            }
                        });
                        var mailOptions = {
                            to: req.body.email,
                            subject: 'Update Email',
                            text: 'please follow this link to validate your account localhost:' + process.env.port + '/check/' + safe
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log('error sending mail - profile update: ', error);
                                res.render('oops', {error: '3'});
                            } else {
                                console.log('sent mail - profile update');
                                res.render('oops', {error: '7'});
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.render('oops', {error: '11'});
    }
});

router.post('/', bodyParser.urlencoded({extended: true}), function(req, res){
    if(!req.session.name) {
        res.render('oops', {error: '2'});
    } else {
        if(req.body.location_status)
        {
            if(req.body.location_status == '0')
            {
                Models.user.findOneAndUpdate({email: req.session.name}, {'location_status': '1'}, function(err, doc){
                    console.log('profile update - updated location tracking policy to: ', doc.location_status);    
                });
            }
            else if (req.body.location_status == '1')
            {
                Models.user.findOneAndUpdate({email: req.session.name}, {'location_status': '0'}, function(err, doc){
                    console.log('profile update - updated location tracking policy to: ', doc.location_status);    
                });
            }
        }
        if(req.body.bio)
        {
            Models.user.findOneAndUpdate({ email : req.session.name }, { 'bio' : req.body.bio }, function(err, _update) {
                console.log('updated bio - profile update');
            });
        }
        if(req.body.username)
        {
            Models.user.findOneAndUpdate({ email : req.session.name }, { 'username' : req.body.username }, function(err, _update) {
                console.log('updated username - profile update');
            });
        }
        if(req.body.name)
        {
            Models.user.findOneAndUpdate({ email : req.session.name }, { 'name' : req.body.name }, function(err, _update) {
                console.log('updated name - profile update');
            });
        }
        if(req.body.surname)
        {
            Models.user.findOneAndUpdate({ email : req.session.name }, { 'surname' : req.body.surname }, function(err, _update) {
                console.log('updated surname - profile update');
            });
        }
        if(req.body.age)
        {
            Models.user.findOneAndUpdate({ email : req.session.name }, { 'age' : req.body.age }, function(err, _update) {
                console.log('updated age - profile update');
            });
        }
        if(req.body.gender_select)
        {
            Models.user.findOneAndUpdate({ email : req.session.name }, { 'gender' : req.body.gender_select }, function(err, _update) {
                console.log('updated gender - profile update');
            });
        }
        if(req.body.pref_select)
        {
            Models.user.findOneAndUpdate({ email : req.session.name }, { 'prefferances' : req.body.pref_select }, function(err, _update) {
                console.log('updated prefferaces - profile update');
            });
        }
        res.redirect('/profile');
    }
});

//export this router to use in our index.js
module.exports = router;