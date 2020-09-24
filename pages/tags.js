const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const Updates = require('../database/db_updates');
app.use(bodyParser.urlencoded({ extended: true }));

router.post('/add_tag', bodyParser.urlencoded({extended: true}), function (req, res){
    if (!req.session.name)
        res.render('oops', {error: '2'});
    else {
        let db = new Updates();
        let outcome = db.addTag(req.session.name, req.body.tag);

        outcome.then(function (success) {
            console.log('Added Tag');
            res.redirect('/profile');
            db.close();
        }, function (err) {
            console.log('Unable To Add Tag');
            res.redirect('/profile');
            db.close();
        });
    }
});

router.post('/remove_tag', bodyParser.urlencoded({extended: true}), function(req, res) {
    if (!req.session.name)
        res.render('oops', {error: '2'});
    else {
        let db = new Updates();
        let outcome = db.removeTag(req.session.name, req.body.tag);
        console.log(req.body.tag);
        outcome.then(function(success) {
            console.log('Removed Tag');
            res.redirect('/profile');
            db.close();
        }, function (err) {
            console.log('Unable To Remove Tag');
            res.redirect('/profile');
            db.close();
        });
    }
});

module.exports = router;