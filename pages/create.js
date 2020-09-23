const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const Database = require('../database/db_queries');

router.get('/', function (req, res) {
   res.render('create');
})

function passwordCheck(password) {

   if (password.length >= 8) {
      if (password.includes(' ') || password.includes('\t') || password.includes('\n') || password.includes('\s')) {
         return false;
      }
      return true;
   } else {
      return false;
   }
}

router.post('/create', bodyParser.urlencoded({extended: true}), function(req, res, next){

   if (passwordCheck(req.body.password)) {

      let db = new Database;

      let registerAttempt = db.register(req.body.username, req.body.name, req.body.surname,
         req.body.email, req.body.password, req.body.age, req.body.gender, req.body.preferences);

		registerAttempt.then(function(ret){
         console.log('Created Account');
         res.render('oops', {error: '7'})
		},
		function (error) {
         console.error(error);
         res.render('oops', {error: '5'});
      });
   } else {
      res.render('oops', {error : '13'});
   }
});

module.exports = router;