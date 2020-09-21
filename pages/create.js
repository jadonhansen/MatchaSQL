var express = require('express');
var router = express.Router();
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const database = require('../database/db_queries');

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
      let db = new database();

      let registerAttempt = db.register(req.body.username, req.body.name, req.body.surname,
         req.body.email, req.body.pass, req.body.age, req.body.gender, req.body.preferences);

		registerAttempt.then(function(ret){
         res.render('oops', {error: '7'})
         console.log('created account');
		},
		function (err) {
         console.error('User Save Error: ', error);
      });
   } else {
      res.render('oops', {error : '13'});
   }
});

module.exports = router;