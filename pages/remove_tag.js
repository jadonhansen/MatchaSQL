var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var models = require('../models/models');

router.post('/', bodyParser.urlencoded({extended: true}), function(req, res) {
    models.user.findOneAndUpdate({email : req.session.name}, {$pull: {'tags' : req.body.tag}}, function(err, doc){
        console.log('removed tag');
    });
    res.redirect('/profile');
  });

module.exports = router;