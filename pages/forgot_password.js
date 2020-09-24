const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const randomstring = require('randomstring');
const email_handler = require('../database/emailing');
const Database = require('../database/db_queries');

router.get('/', (req, res) => {
   res.render('forgot_password');
});

router.post('/', bodyParser.urlencoded({extended: true}), function (req, res) {
   if (!req.body.email) {
      res.render('oops', { error : '11' });
   } else {

      let db = new Database();
      let user = db.get_valid_user_by_email(req.body.email);

      user.then(function(result) {
         if (result[0]) {

            let safe = crypto.pbkdf2Sync(randomstring.generate(), '100', 1000, 64, `sha512`).toString(`hex`);
            let emailRes = email_handler.password_reset_link(result[0].email, safe);

            emailRes.then(function(resultt) {
               let updated = db.updateVerif(safe, result[0].email);

               updated.then(function (ress) {
                  res.render('oops', {error : '4'});
                  db.close();
               }, function (error) {
                  res.render('oops', {error : '3'});
                  db.close();
               });
            }, function(error) {
               res.render('oops', {error : '3'});
               db.close();
            });
         } else {
            db.close();
            console.log('Error Finding User');
            render('oops', {error : '14'});
         }
      }, function (error) {
         db.close();
         console.log('Error Finding User');
         render('oops', {error : '14'});
      });
   }
});

module.exports = router;