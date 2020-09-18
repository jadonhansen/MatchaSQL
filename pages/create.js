var express = require('express');
var router = express.Router();
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var Model = require('../models/models');
var crypto = require('crypto');
var randomstring = require('randomstring');
var nodeMailer = require('nodemailer');

router.get('/', function (req, res) {
   res.render('create');
})

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

router.post('/create', bodyParser.urlencoded({extended: true}), function(req, res, next){
   Model.user.findOne({ email: req.body.email }, function(err, user) {
      if (err) {
         res.render('oops', {error: '3'});
      }
      else if (user) {
         res.render('oops', {error: '5'});
      }
      else {
         if (passwordCheck(req.body.password)) {
            var safe = crypto.pbkdf2Sync(randomstring.generate(), '100' ,1000, 64, `sha512`).toString(`hex`);
            var pass = crypto.pbkdf2Sync(req.body.password, '100' ,1000, 64, `sha512`).toString(`hex`);
   
            var _user = new Model.user ({
               name: req.body.name,
               username: req.body.username,
               surname: req.body.surname,
               email: req.body.email,
               password: pass,
               age: req.body.age,
               gender: req.body.gender,
               prefferances: req.body.preferences,
               verif: safe,
               fame: 0,
               blocked : [],
               location_status : '1'
            });
   
            var present_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            var _notif = new Model.notifications ({
               email: req.body.email,
               name: 'Welcome',
               content: 'Welcome to matcha, may the love be with you',
               time: present_time,
               read: false
            })
            _notif.save(function(err){
               if(err)
                  console.log('notif save error: ', err);
               else
                  console.log('updated notifications');
            });
            _user.save(function(err){
               if(err)
                  console.error('user save error: ', error);
               else
               {
                  // emailer
                  let transporter = nodeMailer.createTransport({
                     host: 'smtp.gmail.com',
                     port: 465,
                     secure: true,
                     auth: {
                        user: 'ftmatcha@gmail.com',
                        pass: 'qwerty0308'
                     }
                  });
                  var mailOptions = {
                     to: req.body.email,
                     subject: 'Email Confirmation',
                     text: 'please follow this link to validate your account localhost:' + process.env.port + '/' + safe
                  };
                  transporter.sendMail(mailOptions, (error, info) => {
                     if (error) {
                         return console.log(error);
                     }
                  });
                  res.render('oops', {error: '7'})
                  console.log('created account');
               }
            });
         } else {
            res.render('oops', {error : '13'});
         }
      }
   }); 
});

//export this router to use in our index.js
module.exports = router;