const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Matches = require('../database/db_matches');
const Likes = require('../database/db_likes');
const Unlikes = require('../database/db_unlikes');

router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {

   if (!req.session.name) return (res.render('oops', { error: '2' }));
   else {
      // // removes images from upload directory when someone accesses this page
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
            let reportContent = { reportee : req.session.name, report : req.body.details };
            Models.user.findOneAndUpdate({ '_id': req.body._id }, { $push: { reports: reportContent } }, function (err, doc) {
               if (err) {
                  console.log('could not report user: ', err);
               } else {
                  console.log('reported user: ', doc.username);
               }
               Models.user.findOne({ email: req.session.name }, { likes : 1, username : 1 }, function (err, curr) {
                  let connected = '0';
                  let liked = '0';
                  if (curr.likes) {
                     if (curr.likes.includes(doc.username)) {
                        liked = '1';
                        if (doc.likes.includes(curr.username))
                           connected = '1';
                     }
                  }
                  res.render('matched_profile', {
                     name: doc.name,
                     surname: doc.surname,
                     username: doc.username,
                     status: doc.status,
                     rating: doc.fame,
                     email: doc.email,
                     gender: doc.gender,
                     prefferances: doc.prefferances,
                     age: doc.age,
                     one: doc.main_image,
                     two: doc.image_one,
                     three: doc.image_two,
                     four: doc.image_three,
                     five: doc.image_four,
                     tags: doc.tags,
                     location: doc.location,
                     location_status: doc.location_status,
                     _id: doc._id,
                     'liked': liked,
                     'connected': connected,
                     bio: doc.bio
                  });
               });
            });
         }
         // BLOCK USER
         else if (req.body.block == '') {
            Models.user.findOne({ '_id': req.body._id }, { password : 0, isverified : 0, contacts : 0, reports : 0, blocked : 0, verif : 0, verif_email : 0}, function (err, doc) {
               Models.user.findOneAndUpdate({ email: req.session.name }, { $addToSet: { blocked : doc.username } }, function (err, check) {
                  // fame decrement friend user
                  if (doc.fame >= 1) {
                     let rating = doc.fame - 1;
                     Models.user.findOneAndUpdate({ '_id': req.body._id }, { fame: rating }, function (err, temp) {
                        if (err) {
                           console.log('could not decrement fame rating of friend - block operation: ', err);
                        } else {
                           console.log('decremented fame rating of friend - block operation');
                        }
                     });
                  }
                  // fame decrement current user
                  if (check.fame >= 1) {
                     let rating = check.fame - 1;
                     Models.user.findOneAndUpdate({ email: req.session.name }, { fame: rating }, function (err, temp) {
                        if (err) {
                           console.log('could not decrement fame rating of current user - block operation: ', err);
                        } else {
                           console.log('decremented fame rating of current user - block operation');
                        }
                     });
                  }
                  res.render('matched_profile', {
                     name: doc.name,
                     surname: doc.surname,
                     username: doc.username,
                     status: doc.status,
                     rating: doc.fame,
                     email: doc.email,
                     gender: doc.gender,
                     prefferances: doc.prefferances,
                     age: doc.age,
                     tags: doc.tags,
                     one: doc.main_image,
                     two: doc.image_one,
                     three: doc.image_two,
                     four: doc.image_three,
                     five: doc.image_four,
                     location: doc.location,
                     location_status: doc.location_status,
                     _id: doc._id,
                     'liked': '0',
                     'connected': '0',
                     bio: doc.bio
                  });
                  console.log('blocked user: ', doc.username);
                  // remove user from logged in user 'LIKES' array
                  Models.user.findOneAndUpdate({ email: req.session.name }, { $pull: { likes: doc.username } }, function (err, ret) {
                     if (err) {
                        console.log('unable to remove username from current users "likes" array', err);
                     } else {
                        console.log('removed username from current users "likes" array');
                     }
                  });
                  // remove user from logged in user 'LIKED' array
                  Models.user.findOneAndUpdate({ email: req.session.name }, { $pull: { liked: doc.username } }, function (err, ret) {
                     if (err) {
                        console.log('unable to remove username from current users "liked" array', err);
                     } else {
                        console.log('removed username from current users "liked" array');
                     }
                  });
                  // removing logged in user into liked users 'LIKED' array
                  Models.user.findOneAndUpdate({ '_id': req.body._id }, { $pull: { liked: check.username } }, function (err, ret) {
                     if (err) {
                        console.log('unable to remove username from liked users "liked" array: ', err);
                     } else {
                        console.log('removed username from liked users "liked" array');
                     }
                  });
                  // removing logged in user into liked users 'LIKES' array
                  Models.user.findOneAndUpdate({ '_id': req.body._id }, { $pull: { likes: check.username } }, function (err, ret) {
                     if (err) {
                        console.log('unable to remove username from liked users "likes" array: ', err);
                     } else {
                        console.log('removed username from liked users "likes" array');
                     }
                  });
               });
            });
         }
         else {
            console.log('THIS "ELSE" STATEMENT IS IN USE - matched profile');
            let db = new Matches();
            let userRender = db.renderMatchedUser(req.session.name, req.body._id);
   
            userRender.then(function (ret) {
               db.close();
               console.log('Connected: ', ret.connected, ' - Liked: ', ret.liked);
               res.render('matched_profile', {  name: ret.name,
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
                                                bio: ret.bio});
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
            res.render('matched_profile', {  name: ret.name,
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
                                             bio: ret.bio});
         }, function (err) {
            console.log(err);
            db.close();
            res.render('oops', {error : '3'});
         });
      }
   }
});

module.exports = router;