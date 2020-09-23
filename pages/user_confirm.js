const express = require('express');
const mysql = require('mysql');
const Database = require('../database/db_queries');
const router = express.Router();

router.get('/', function(req, ret){

   const check = req.originalUrl.substring(1);

   let db = new Database();

   let sql = "SELECT * FROM users WHERE verif = ? AND isverified = ?";
   let inserts = [check, 1];
   sql = mysql.format(sql, inserts);
   let user = db.query(sql);

   user.then(function (res) {
      if (!res[0]) {
         
         // verify link
         sql = "UPDATE users set isverified = ? WHERE verif = ?";
         inserts = [1, check];
         sql = mysql.format(sql, inserts);
         let changedUser = db.query(sql);

         console.log('User Confirmed.');
         ret.render('login', {url: check});
      } else {
         // reset password
         ret.render('reset_password', {url:check});
      }
   });
});

module.exports = router;