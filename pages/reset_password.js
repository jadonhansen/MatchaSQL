const express = require('express');
const router = express.Router();
const Models = require('../models/models');
const bodyParser = require('body-parser');
const crypto = require('crypto');

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

router.post('/', bodyParser.urlencoded({extended: true}), function(req, res){
    if (req.body.password == req.body.repeat) {
        if (passwordCheck(req.body.password)) {
            const pass = crypto.pbkdf2Sync(req.body.password, '100' ,1000, 64, `sha512`).toString(`hex`);
            Models.user.findOneAndUpdate({ verif : req.body.url }, { 'password' : pass }, function(err, doc){
                if (err) {
                    console.log('could not reset password: ', err);
                    res.render('oops', {error: '3'});
                } else {
                    console.log('succesful password reset: ', doc.username, doc.email, doc.verif);
                    res.redirect('login');
                }
            });
        } else {
            res.render('oops', {error : '13'});
        }
    }
    else
        res.render('oops', {error: '8'});
})

module.exports = router;