const models = require('../models/models');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.post('/remove_chat', bodyParser.urlencoded({ extended: true }), function(req, res){

    if(!req.session.name)
        res.render('oops', {error : '2'});
    else {
        models.user.findOneAndUpdate({ email : req.session.name }, { $pull : { contacts : req.body.email } }, function (err, res) {
            if (err) {
                console.log('unable to delete user from contacts: ', req.body.email);
            } else {
                console.log('deleted user from contacts: ', req.body.email);
            }
        });
    }
});

router.get('/', function(req, res){
    if(!req.session.name)
        res.render('oops', {error : '2'});
    else {
        res.render('contacts');
    }
});

router.get('/live_contacts', function(req, res){
    if(!req.session.name)
        res.render('oops', {error : '2'});
    else {
        models.user.findOne({ email : req.session.name }, { contacts : 1 },  function (err, doc){
            if (err) {
                console.log('error retrieving current user details - contacts: ', err);
                res.render('oop', {error : '3'});
            } else {
                contacts = doc.contacts;
                if (contacts.length !== 0) {
                    models.user.find({ isverified : true }, { main_image : 1, username : 1, bio : 1, email : 1 },  function (err, chatters) {
                        let contArr = new Array;
                        if (err) {
                            console.log('error retrieving users - contacts: ', err);
                        } else {
                            chatters.forEach(element => {
                                if (contacts.includes(element.email)) {
                                    contArr.push(element);
                                    console.log('put new contact in resulting array: ', element.username, element.email, element.bio);
                                }
                            });
                        }
                        res.json({ contactArr : contArr });
                    });
                } else {
                    res.json({ contactArr : [] });
                }
            }
        });
    }
});

module.exports = router;