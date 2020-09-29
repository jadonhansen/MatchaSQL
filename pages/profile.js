const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Database = require('../database/db_queries');
const mysql = require('mysql');

router.post('/update_location', bodyParser.urlencoded({extended: true}), function(req, res){

   if (!req.session.name) return(res.render('oops', {error: '2'}));

   if (req.body.location_text) {
      let db = new Database();

      let sql = "UPDATE users SET location = ? WHERE username = ?";
      let inserts = [req.body.location_text, req.session.name];
      sql = mysql.format(sql, inserts);
      db.query(sql);
      console.log('Updated Location');
   }
   res.redirect('/profile');
});

router.get('/', function(req, res){
   if(!req.session.name) {
      return(res.render('oops', {error: '2'}));
   } else {
      let db = new Database();
      let user = db.get_valid_user(req.session.name);

      user.then(function(usr) {
         if (!usr[0]) {
            return res.render('oops', {error: '1'});
         }

         let tags = db.getUserTags(req.session.name);
         tags.then(function(tagArr) {

            let views = db.getUserViews(req.session.name);
            views.then(function(viewsArr) {

               let viewed = db.getUserViewed(req.session.name);
               viewed.then(function(viewedArr) {

                  let likes = db.getUserLikes(req.session.name);
                  likes.then(function(likesArr) {

                     let liked = db.getUserLiked(req.session.name);
                     liked.then(function(likedArr) {

                        console.log('Liked: ', likedArr);
                        console.log('Likes: ', likesArr);
                        console.log('Viewed: ', viewedArr);
                        console.log('Views: ', viewsArr);
                        console.log('Tags: ', tagArr);

                        res.render('profile', {name: usr[0].name,
                           surname: usr[0].surname,
                           email: usr[0].email,
                           username: usr[0].username,
                           one: usr[0].main_image,
                           two: usr[0].image_one,
                           three: usr[0].image_two,
                           four: usr[0].image_three,
                           five: usr[0].image_four,
                           views: viewsArr,
                           viewed: viewedArr,
                           likes: likesArr,
                           liked: likedArr,
                           rating: usr[0].fame,
                           gender: usr[0].gender,
                           prefferances: usr[0].prefferances,
                           age: usr[0].age,
                           tags: tagArr,
                           location_status: usr[0].location_status,
                           location: usr[0].location,
                           bio: usr[0].bio});
                     }, function(err) {
                        console.log(err);
                        return res.render('oops', {error: '3'});
                     });
                  }, function(err) {
                     console.log(err);
                     return res.render('oops', {error: '3'});
                  });
               }, function(err) {
                  console.log(err);
                  return res.render('oops', {error: '3'});
               });
            }, function(err) {
               console.log(err);
               return res.render('oops', {error: '3'});
            });
         }, function(err) {
            console.log(err);
            return res.render('oops', {error: '3'});
         });
      }, function(err) {
         console.log(err);
         return res.render('oops', {error: '1'});
      });
   }
});

module.exports = router;