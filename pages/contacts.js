const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Database = require('../database/db_queries');

router.post('/remove_chat', bodyParser.urlencoded({ extended: true }), function(req, res){

    if (!req.session.name) res.render('oops', {error : '2'});
    else {
        let db = new Database();
        let outcome = db.deleteContact(req.session.name, req.body.email);

        outcome.then(function (success) {
            console.log('Deleted User From Contacts');
            db.close();
        }, function (err) {
            console.log('Unable To Delete User From Contacts');
            db.close();
        });
    }
});

router.get('/', function(req, res){
    if (!req.session.name) res.render('oops', {error : '2'});
    else res.render('contacts');
});

router.get('/live_contacts', function(req, res){
    if (!req.session.name) res.render('oops', {error : '2'});
    else {
        let db = new Database();
        let contacts = db.getContacts(req.session.name);

        contacts.then(function (contactArray) {
            if (contactArray[0]) {
                let users = db.getContactUsers(contactArray);

                users.then(function (resArr) {
                    console.log('Contact Array: ', resArr);
                    res.json({contactArr : resArr});
                    db.close();
                }, function (err) {
                    console.log('Error Creating Contacts Array - Continuing');
                    res.json({contactArr : []});
                    db.close();
                });
            } else {
                res.json({contactArr : []});
                db.close();
            }
        }, function (err) {
            console.log('Unable To Fetch Contacts');
            db.close();
            res.render('oops', {error: '3'});
        });
    }
});

module.exports = router;