const express = require('express');
const router = express.Router();
const app = express()
const bodyParser = require('body-parser');
const Models = require('../models/models');
app.use(bodyParser.urlencoded({ extended: true }));

router.post('/', bodyParser.urlencoded({extended: true}), function (req, res){
    if(!req.session.name)
        res.render('oops', {error: '2'});
    else {
        Models.user.findOneAndUpdate({ email : req.session.name }, { $push : { tags: req.body.tag}}, function(err, _update) {
            if (err) {
                console.log('could not add tag: ', err);
            } else {
                console.log('added tag');
            }
            res.redirect('/profile');
        });
    }
});

module.exports = router;