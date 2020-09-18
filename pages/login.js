const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const Models = require('../models/models');
const crypto = require('crypto');
const axios = require('axios');

router.get('/', (req,res) => {
   res.render('login');
});

router.post('/', bodyParser.urlencoded({extended: true}), function(req, res){

   Models.user.findOne({ username: req.body.username }, { username : 1, password : 1, isverified : 1, email : 1 }, function(err, user) {
      if (user) {
         const safe = crypto.pbkdf2Sync(req.body.password, '100' ,1000, 64, `sha512`).toString(`hex`);

            if (user.password == safe && user.isverified == true) {
               // ip tracking
               axios.post(`https://ipinfo.io?token=${process.env.TOKEN}`, { json: true }).then(res => {
                  if (res) {
                     let ipLocat = `${res.data.city}, ${res.data.region}, ${res.data.country}, ${res.data.postal}`;
                     console.log('ipLocat: ', ipLocat);

                     Models.user.findOneAndUpdate({ username : req.body.username }, { location : ipLocat }, function(err, _update){
                        if (err) {
                           console.log('error updating location: ', err);
                        } else {
                           console.log('updated location');
                        }
                     });
                  }
               }).catch(error => {
                  console.log('ipinfo error: ', error);
               });
               // online status
               Models.user.findOneAndUpdate({ username : req.body.username }, { status : 'online' }, function(err, _update){
                  if (err) {
                     console.log('error updating status');
                  } else {
                     console.log('user set to online');
                  }
               });
              //setting session
               req.session.name = user.email;
               res.redirect('/profile');
            }
            else if (user.isverified !== true)
               res.render('oops', {error: '6'})
            else
               res.render('oops', {error: '1'});
      }
      else
      {
         res.render('oops', {error: '1'});
      }
   });
});

//export this router to use in our index.js
module.exports = router;