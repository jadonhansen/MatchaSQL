const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const Matches = require('../database/db_matches');
const Likes = require('../database/db_likes');
const Unlikes = require('../database/db_unlikes');
const Options = require('../database/db_options');

router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {

   if (!req.session.name) return (res.render('oops', { error: '2' }));
   else {
      // removes images from upload directory when someone accesses this page
      fs.readdir(process.env.path, function (err, items) {
         items.forEach(element => {
            fs.unlink(process.env.path + '/' + element)
         });
      });

      if (req.body.unique !== '1') {

         // LIKING USER
         if (req.body.like == '') {
            let db = new Likes();
            let ret = db.likeUser(req.body._id, req.session.name);

            ret.then(function (usr) {
               console.log('Liked User');
               db.close();
               res.render('matched_profile', {
                  name: usr.name,
                  email: usr.email,
                  surname: usr.surname,
                  username: usr.username,
                  status: usr.status,
                  rating: usr.fame,
                  gender: usr.gender,
                  prefferances: usr.prefferances,
                  age: usr.age,
                  tags: usr.tags,
                  location: usr.location,
                  location_status: usr.location_status,
                  _id: usr.userID,
                  one: usr.main_image,
                  two: usr.image_one,
                  three: usr.image_two,
                  four: usr.image_three,
                  five: usr.image_four,
                  liked: usr.liked,
                  connected: usr.connected,
                  bio: usr.bio
               });
            }, function (err) {
               console.log(err);
               db.close();
               res.render('oops', {error : '3'});
            });
         }
         // UNLIKE USER
         else if (req.body.unlike == '') {

            let db = new Unlikes();
            let ret = db.unlikeUser(req.body._id, req.session.name);

            ret.then(function (usr) {
               console.log('Unliked User');
               db.close();
               res.render('matched_profile', {
                  name: usr.name,
                  email: usr.email,
                  surname: usr.surname,
                  username: usr.username,
                  status: usr.status,
                  rating: usr.fame,
                  gender: usr.gender,
                  prefferances: usr.prefferances,
                  age: usr.age,
                  tags: usr.tags,
                  location: usr.location,
                  location_status: usr.location_status,
                  _id: usr.userID,
                  one: usr.main_image,
                  two: usr.image_one,
                  three: usr.image_two,
                  four: usr.image_three,
                  five: usr.image_four,
                  liked: 0,
                  connected: 0,
                  bio: usr.bio
               });
            }, function (err) {
               console.log(err);
               db.close();
               res.render('oops', {error : '3'});
            });
         }
         // REPORT FAKE USER
         else if (req.body.fake == '') {

            let db = new Options();
            let ret = db.reportUser(req.body._id, req.session.name, req.body.details);

            ret.then(function (usr) {
               console.log('Reported User');
               db.close();
               res.render('matched_profile', {
                  name: usr.name,
                  surname: usr.surname,
                  username: usr.username,
                  status: usr.status,
                  rating: usr.fame,
                  email: usr.email,
                  gender: usr.gender,
                  prefferances: usr.prefferances,
                  age: usr.age,
                  one: usr.main_image,
                  two: usr.image_one,
                  three: usr.image_two,
                  four: usr.image_three,
                  five: usr.image_four,
                  tags: usr.tags,
                  location: usr.location,
                  location_status: usr.location_status,
                  _id: usr.userID,
                  liked: usr.liked,
                  connected: usr.connected,
                  bio: usr.bio
               });
            }, function (err) {
               db.close();
               console.log(err);
               res.render('oops', {error : '3'});
            });
         }
         // BLOCK USER
         else if (req.body.block == '') {

            let db = new Options();
            let ret = db.blockUser(req.body._id, req.session.name);

            ret.then(function (usr) {
               console.log('Blocked User');
               db.close();
               res.render('matched_profile', {
                  name: usr.name,
                  surname: usr.surname,
                  username: usr.username,
                  status: usr.status,
                  rating: usr.fame,
                  email: usr.email,
                  gender: usr.gender,
                  prefferances: usr.prefferances,
                  age: usr.age,
                  tags: usr.tags,
                  one: usr.main_image,
                  two: usr.image_one,
                  three: usr.image_two,
                  four: usr.image_three,
                  five: usr.image_four,
                  location: usr.location,
                  location_status: usr.location_status,
                  _id: usr.userID,
                  liked: usr.liked,
                  connected: usr.connected,
                  bio: usr.bio
               });
            }, function (err) {
               db.close();
               console.log(err);
               res.render('oops', {error : '3'});
            });
         }
         else {
            console.log('THIS "ELSE" STATEMENT IS IN USE - matched profile');
            let db = new Matches();
            let userRender = db.renderMatchedUser(req.session.name, req.body._id);
   
            userRender.then(function (ret) {
               db.close();
               console.log('Connected: ', ret.connected, ' - Liked: ', ret.liked);
               res.render('matched_profile', {
                  name: ret.name,
                  surname: ret.surname,
                  email: ret.email,
                  username: ret.username,
                  status: ret.status,
                  rating: ret.fame,
                  gender: ret.gender,
                  prefferances: ret.prefferances,
                  age: ret.age,
                  one: ret.main_image,
                  two: ret.image_one,
                  three: ret.image_two,
                  four: ret.image_three,
                  five: ret.image_four,
                  tags: ret.tags,
                  location: ret.location,
                  location_status: ret.location_status,
                  _id: req.body._id,
                  liked: ret.liked,
                  connected: ret.connected,
                  bio: ret.bio
               });
            }, function (err) {
               console.log(err);
               db.close();
               res.render('oops', {error : '3'});
            });
         }
      }
      // else if req.body.unique == '1'
      else {
         let db = new Matches();
         let userRender = db.renderMatchedUser(req.session.name, req.body._id);

         userRender.then(function (ret) {
            db.close();
            console.log('Connected: ', ret.connected, 'Liked: ', ret.liked);
            res.render('matched_profile', {
               name: ret.name,
               surname: ret.surname,
               email: ret.email,
               username: ret.username,
               status: ret.status,
               rating: ret.fame,
               gender: ret.gender,
               prefferances: ret.prefferances,
               age: ret.age,
               one: ret.main_image,
               two: ret.image_one,
               three: ret.image_two,
               four: ret.image_three,
               five: ret.image_four,
               tags: ret.tags,
               location: ret.location,
               location_status: ret.location_status,
               _id: req.body._id,
               liked: ret.liked,
               connected: ret.connected,
               bio: ret.bio
            });
         }, function (err) {
            console.log(err);
            db.close();
            res.render('oops', {error : '3'});
         });
      }
   }
});

module.exports = router;