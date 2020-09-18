const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
   if(!req.session.name) {
      res.render('oops', {error: '2'});
   }
   else {
      res.render('notifications');
   }
});

module.exports = router;