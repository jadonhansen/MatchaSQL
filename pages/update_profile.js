var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var crypto = require('crypto');
var randomstring = require('randomstring');
const encrypt = require('../database/crypting');
const email_handler = require('../database/emailing');
const Database = require('../database/db_queries');
const Updates = require('../database/db_updates');

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

router.post('/update_password', bodyParser.urlencoded({extended: true}), function(req, res){
    if (!req.session.name) {
        res.render('oops', {error: '2'});
    } else {
        if (req.body.pass && req.body.repeat_pass && req.body.pass == req.body.repeat_pass) {
            if (passwordCheck(req.body.pass)) {
                let hash = encrypt.cryptPassword(req.body.pass);

                hash.then(function (hashRes) {
                    let db = new Updates();
                    let ret = db.updatePassword(hashRes, req.session.name);
    
                    ret.then(function (result) {
                        res.redirect('/profile');
                        db.close();
                    }, function (err) {
                        res.render('oops', {error: '3'});
                        db.close();
                    });
                });
            } else res.render('oops', {error: '13'});
        } else res.render('oops', {error: '8'});
    }
});

router.post('/update_email', bodyParser.urlencoded({extended: true}), function(req, res){
    if(!req.session.name) {
        return(res.render('oops', {error: '2'}));
    } else if (req.body.email) {

        let db = new Database();
        let user = db.get_valid_user_by_email(req.body.email);

        user.then(function(validUsr) {
            db.close();
            if (validUsr[0]) {
                console.log('Existing Email Found - Profile Email Update');
                res.render('oops', {error: '9'});
            }
        }, function (err) {
            let verif = crypto.pbkdf2Sync(randomstring.generate(), '100' ,1000, 64, `sha512`).toString(`hex`);

            let updateDB = new Updates();
            let updated = updateDB.updateVerifAndVerifEmail(verif, req.body.email, req.session.name);

            updated.then(function (result) {
                console.log('Set New Verif Email - Profile Update');
                let email = email_handler.updatedEmailLink(req.body.email, verif);

                email.then(function (success) {
                    console.log('Sent Mail - Email Profile Update');
                    updateDB.close();
                    res.render('oops', {error: '7'});
                }, function (error) {
                    console.log('Error Sending Mail - Profile Update');
                    updateDB.close();
                    res.render('oops', {error: '3'});
                });
            }, function (errr) {
                console.log('Unable To Set Verif - Profile Update');
                updateDB.close();
                res.render('oops', {error: '3'});
            });
        });
    } else {
        res.render('oops', {error: '11'});
    }
});

router.post('/', bodyParser.urlencoded({extended: true}), function(req, res){
    if (!req.session.name) {
        res.render('oops', {error: '2'});
    } else {
        let db = new Updates();
        if (req.body.location_status) {
            if( req.body.location_status == '0') {
                let update = db.updateLocationStatus(req.session.name, 1);
            }
            else if (req.body.location_status == '1') {
                let update = db.updateLocationStatus(req.session.name, 0);
            }
        }
        if (req.body.bio) {
            let update = db.updateBio(req.session.name, req.body.bio);
        }
        if (req.body.username) {
            let update = db.updateUsername(req.session.name, req.body.username);
            req.session.name = req.body.username;
        }
        if (req.body.name) {
            let update = db.updateName(req.session.name, req.body.name);
        }
        if (req.body.surname) {
            let update = db.updateSurname(req.session.name, req.body.surname);
        }
        if (req.body.age) {
            let update = db.updateAge(req.session.name, req.body.age);
        }
        if(req.body.gender_select) {
            let update = db.updateGender(req.session.name, req.body.gender_select);
        }
        if(req.body.pref_select) {
            let update = db.updatePreffs(req.session.name, req.body.pref_select);
        }
        res.redirect('/profile');
    }
});

module.exports = router;