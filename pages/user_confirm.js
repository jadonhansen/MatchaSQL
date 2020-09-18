const express = require('express');
const router = express.Router();
const Models = require('../models/models');

router.get('/', function(req, res){

   const check = req.originalUrl.substring(1);

   Models.user.findOne({verif : check, isverified : 'true'}, { email : 1 }, function(err, doc) {
   
      if (err) {
         console.log('error finding verif key - user confirm: ', err);
      } else if (doc) {
         console.log('user confirm route');
         res.render('reset_password', {url:check});
      } else {
         // insert user check for forgot password link
         console.log('user confirm route - verify link');

         Models.user.findOneAndUpdate({ verif : check }, { $set : { isverified: 'true'}}, function(err, doc) {
            if (doc && doc.email) {
               res.render('login', {url: check});
            } else {
               res.render('oops', { error : '3' });
            }
         });
      }
   });
})

//export this router to use in our index.js
module.exports = router;