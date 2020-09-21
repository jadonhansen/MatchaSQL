const express = require('express');
const mysql = require('mysql');
const database = require('../database/db_queries');
const router = express.Router();

router.get('/', function(req, res){

   const check = req.originalUrl.substring(1);

   db = new database();
   let sql = "SELECT * FROM users WHERE verif = ? AND isverified = ?";
   let inserts = [check, 1];
   sql = mysql.format(sql, inserts);
   let user = db.query(sql);

   user.then(function (res) {
      if (!ret[0]) {
         // verify link
         db = new database();
         let sql = "UPDATE users set isverified = ? WHERE verif = ?";
         let inserts = [1, check];
         sql = mysql.format(sql, inserts);
         let user = db.query(sql);

         user.then(function (res) {
            if (res[0].isverified == 1) {
               res.render('login', {url: check});
            } else {
               res.render('oops', { error : '3' });
            }
         });
      } else {
         // reset password
         res.render('reset_password', {url:check});
      }
   });
});

module.exports = router;