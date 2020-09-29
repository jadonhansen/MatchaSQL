const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const axios = require('axios');
const Database = require('../database/db_queries');

router.get('/', (req, res) => {
   res.render('login');
});

router.post('/', bodyParser.urlencoded({extended: true}), function(req, ress){

   db = new Database();
   let loginAttempt = db.login(req.body.username, req.body.password);

   loginAttempt.then(function(attemptRes) {
      db.query(`UPDATE users SET status = 'online' WHERE username = '${req.session.username}'`);

      // ip tracking
      axios.post(`https://ipinfo.io?token=${process.env.TOKEN}`, { json: true }).then(result => {
         if (result) {
            let ipLocat = `${result.data.city}, ${result.data.region}, ${result.data.country}, ${result.data.postal}`;
            console.log('ipLocat: ', ipLocat);

            db = new Database();
            db.query(`UPDATE users set location = '${ipLocat}' WHERE username = '${req.body.username}'`);
            db.close();
         }
      }).catch(error => {
         console.log('Ipinfo Axios Error: ', error);
         db.close();
      });

      //setting session
      req.session.name = req.body.username;
      ress.redirect('/profile');
   }, function(err) {
      if (err == 'Incorrect password' || err == 'Username does not exist.') {
         ress.render('oops', {error: '1'});
      } else if (err == 'Please confirm your email with the link sent to continue.') {
         ress.render('oops', {error: '6'});
      }
      db.close();
   });
});

module.exports = router;