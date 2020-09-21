const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const crypto = require('crypto');
const axios = require('axios');
const Database = require('../database/db_queries');
const mysql = require('mysql');

router.get('/', (req,res) => {
   res.render('login');
});

router.post('/', bodyParser.urlencoded({extended: true}), function(req, res){

   db = new Database();

   let loginAttempt = db.login(req.body.username, req.body.password);

   loginAttempt.then(function(res){
      db.query(`UPDATE users SET status = 'online' WHERE username = '${req.session.username}'`);
      
      // ip tracking
      axios.post(`https://ipinfo.io?token=${process.env.TOKEN}`, { json: true }).then(result => {
         if (result) {
            let ipLocat = `${result.data.city}, ${result.data.region}, ${result.data.country}, ${result.data.postal}`;
            console.log('ipLocat: ', ipLocat);

            db = new Database();
            let sql = "UPDATE users set location = ? WHERE username = ?";
            let inserts = [ipLocat, req.body.username];
            sql = mysql.format(sql, inserts);
            let user = db.query(sql);

            user.then(function (ress) {
                if (ress[0]) {
                  console.log('updated location');
                }
            },
               function (err) {
                  console.log('error updating location: ', err);

           });
         }
      }).catch(error => {
         console.log('ipinfo error: ', error);
      });

      //setting session
      req.session.name = req.username;
      res.redirect('/profile');
   },
   function(err){
      res.json(err);
      db.close();
   });

});

module.exports = router;