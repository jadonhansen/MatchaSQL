var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.render('oops', {error: 2});
});

module.exports = router;