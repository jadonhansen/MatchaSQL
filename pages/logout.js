const express = require('express');
const router = express.Router();
const Updates = require('../database/db_updates');

router.get('/', function(req, res){

    let db = new Updates();

    let outcome = db.updateStatus(req.session.name, new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));

    outcome.then(function (success) {
        console.log('Set Last Seen Time');
        db.close();
    }, function (err) {
        console.log('Unable To Set Last Seen Time');
        db.close();
    });
    delete req.session.name;
    res.redirect('/login');
});

module.exports = router;