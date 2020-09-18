const express = require('express');
const router = express.Router();
const Models = require('../models/models');
const bodyParser = require('body-parser');

router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {

   if (!req.session.name) {
      return (res.render('oops', { error: '2' }));
   } else {
      // removes images from uload directory when someone accesses this page
      fs.readdir(process.env.path, function (err, items) {
         items.forEach(element => {
            fs.unlink(process.env.path + '/' + element)
         });
      });
      if (req.body.unique !== '1') {
         // liking user
         if (req.body.like == '') {
            Models.user.findOne({ '_id': req.body._id }, { password : 0, isverified : 0, contacts : 0, reports : 0, blocked : 0, verif : 0, verif_email : 0}, function (err, doc) {
               // fame increment
               rating = doc.fame + 1;
               Models.user.findOneAndUpdate({ '_id': req.body._id }, { fame: rating }, function (err, temp) {
                  if (err) {
                     console.log('could not increment fame rating - like operation: ', err);
                  } else {
                     console.log('incremented fame rating - like operation');
                  }
               });
               // render and render checks
               Models.user.findOneAndUpdate({ email: req.session.name }, { $addToSet: { likes: doc.username } }, function (err, ret) {
                  connected = '0';
                  if (doc.likes.includes(ret.username)) {
                     connected = '1';
                  }
                  console.log('liked user');
                  console.log('Connected state: ', connected);
                  res.render('matched_profile', {
                     name: doc.name,
                     email: doc.email,
                     surname: doc.surname,
                     username: doc.username,
                     status: doc.status,
                     rating: doc.fame,
                     gender: doc.gender,
                     prefferances: doc.prefferances,
                     age: doc.age,
                     tags: doc.tags,
                     location: doc.location,
                     location_status: doc.location_status,
                     _id: doc._id,
                     one: doc.main_image,
                     two: doc.image_one,
                     three: doc.image_two,
                     four: doc.image_three,
                     five: doc.image_four,
                     liked: '1',
                     'connected': connected,
                     bio: doc.bio
                  });
                  // remove user from current users blocked array IF they are blocked
                  Models.user.findOneAndUpdate({ email: req.session.name }, { $pull: { blocked: doc.username } }, function (err, ret) {
                     if (err) {
                        console.log('unable to remove username from current users "blocked" array', err);
                     } else {
                        console.log('removed username from current users "blocked" array');
                     }
                  });
                  // adding logged in user into liked users 'liked' array
                  Models.user.findOneAndUpdate({ '_id': req.body._id }, { $addToSet: { liked: ret.username } }, function (err, ret) {
                     if (err) {
                        console.log('unable to add username to liked users liked array: ', err);
                     } else {
                        console.log('added username to liked users liked array');
                     }
                  });
                  // like notification
                  let roughDate = new Date();
                  let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
                  var _notif = new Models.notifications({
                     email: doc.email,
                     name: 'liked',
                     content: 'you where just liked by ' + ret.username,
                     time: newDate,
                     read: false
                  });
                  _notif.save(function (err) {
                     if (err)
                        console.log('could not save notification - like operation', err);
                     else
                        console.log('updated notifications - like operation');
                  });
               });
            });
         }
         // unlike user
         else if (req.body.unlike == '') {
            Models.user.findOne({ '_id': req.body._id }, { password : 0, isverified : 0, contacts : 0, reports : 0, blocked : 0, verif : 0, verif_email : 0}, function (err, doc) {
               // fame decrement
               if (doc.fame >= 1) {
                  rating = doc.fame - 1;
                  Models.user.findOneAndUpdate({ '_id': req.body._id }, { fame: rating }, function (err, temp) {
                     if (err) {
                        console.log('could not decrement fame rating - unlike operation: ', err);
                     } else {
                        console.log('decremented fame rating - unlike operation');
                     }
                  });
               }
               // render
               res.render('matched_profile', {
                  name: doc.name,
                  surname: doc.surname,
                  username: doc.username,
                  status: doc.status,
                  email: doc.email,
                  rating: doc.fame,
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
                  liked: '0',
                  connected: '0',
                  bio: doc.bio
               });
               // remove user from logged in user 'likes' array
               Models.user.findOneAndUpdate({ email: req.session.name }, { $pull: { likes: doc.username } }, function (err, ret) {
                  if (err) {
                     console.log('could not unlike user: ', err);
                  } else {
                     console.log('unliked user');
                  }
                  // removing logged in user into liked users 'liked' array
                  Models.user.findOneAndUpdate({ '_id': req.body._id }, { $pull: { liked: ret.username } }, function (err, ret) {
                     if (err) {
                        console.log('unable to remove username from liked users "liked" array: ', err);
                     } else {
                        console.log('removed username from liked users "liked" array');
                     }
                  });
                  // unlike notification
                  let roughDate = new Date();
                  let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
                  var _notif = new Models.notifications({
                     email: doc.email,
                     name: 'unliked',
                     content: 'you where just unliked by ' + ret.username,
                     time: newDate,
                     read: false
                  });
                  _notif.save(function (err) {
                     if (err)
                        console.log('could not save notification - unlike operation', err);
                     else
                        console.log('updated notifications - unlike operation');
                  });
               });
            });
         }
         // report fake user
         else if (req.body.fake == '') {
            reportContent = { reportee : req.session.name, report : req.body.details };
            Models.user.findOneAndUpdate({ '_id': req.body._id }, { $push: { reports: reportContent } }, function (err, doc) {
               if (err) {
                  console.log('could not report user: ', err);
               } else {
                  console.log('reported user: ', doc.username);
               }
               Models.user.findOne({ email: req.session.name }, { likes : 1, username : 1 }, function (err, curr) {
                  connected = '0';
                  liked = '0';
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
         // block user
         else if (req.body.block == '') {
            Models.user.findOne({ '_id': req.body._id }, { password : 0, isverified : 0, contacts : 0, reports : 0, blocked : 0, verif : 0, verif_email : 0}, function (err, doc) {
               Models.user.findOneAndUpdate({ email: req.session.name }, { $addToSet: { blocked : doc.username } }, function (err, check) {
                  // fame decrement friend user
                  if (doc.fame >= 1) {
                     rating = doc.fame - 1;
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
                     rating = check.fame - 1;
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
            Models.user.findOne({ email: req.session.name }, { likes : 1, username : 1 }, function (err, check) {
               Models.user.findOne({ '_id': req.body._id }, { password : 0, isverified : 0, contacts : 0, reports : 0, blocked : 0, verif : 0, verif_email : 0}, function (err, doc) {
                  connected = '0';
                  liked = '0';
                  if (check.likes) {
                     if (check.likes.includes(doc.username)) {
                        liked = '1';
                        if (doc.likes.includes(check.username)) {
                           connected = '1';
                           console.log('both connected');
                        }
                     }
                  }
                  res.render('matched_profile', {
                     name: doc.name,
                     surname: doc.surname,
                     username: doc.username,
                     status: doc.status,
                     rating: doc.fame,
                     gender: doc.gender,
                     prefferances: doc.prefferances,
                     age: doc.age,
                     one: doc.main_image,
                     two: doc.image_one,
                     three: doc.image_two,
                     four: doc.image_three,
                     five: doc.image_four,
                     email: doc.email,
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
      }
      // else if req.body.unique == '1'
      else {
         Models.user.findOne({ email: req.session.name }, { likes : 1, username : 1 }, function (err, check) {
            Models.user.findOneAndUpdate({ '_id': req.body._id }, { $addToSet: { views: check.username } }, function (err, doc) {
               // checking for likes, connectivity
               connected = '0';
               liked = '0';
               if (check.likes) {
                  if (check.likes.includes(doc.username)) {
                     liked = '1';
                     if (doc.likes.includes(check.username)) {
                        connected = '1';
                        console.log('both connected');
                     }
                  }
               }
               res.render('matched_profile', {
                  name: doc.name,
                  surname: doc.surname,
                  email: doc.email,
                  username: doc.username,
                  status: doc.status,
                  rating: doc.fame,
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
                  _id: req.body._id,
                  'liked': liked,
                  'connected': connected,
                  bio: doc.bio
               });
               // viewed statistics
               Models.user.findOneAndUpdate({ 'email': req.session.name }, { $addToSet: { viewed: doc.username } }, function (err, temp) {
                  if (err)
                     console.log('could not update view history: ', err);
                  else
                     console.log('updated the view history')
               });
               // notification of viewed profile
               let roughDate = new Date();
               let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
               var _notif = new Models.notifications({
                  email: doc.email,
                  name: 'profile view',
                  content: check.username + ' viewed your profile!',
                  time: newDate,
                  read: false
               });
               _notif.save(function (err) {
                  if (err)
                     console.log('could not save notif: ', err);
                  else
                     console.log('updated notifications');
               });
            });
         });
      }
   }
});

//export this router to use in our index.js
module.exports = router;