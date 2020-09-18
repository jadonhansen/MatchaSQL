const express = require('express');
const models = require('../models/models');
const router = express.Router();
const bodyParser = require('body-parser');

router.post('/remove_notif', bodyParser.urlencoded({ extended: true }), (req, res) => {

    models.notifications.findByIdAndDelete({ _id : req.body.id }, function (err, ret) {
        if (err) {
            console.log('unable to delete notification by id: ', err);
        } else {
            console.log('deleted notification by id: ', req.body.id);
        }
    });
});

router.get('/update_read', (req, res) => {
    models.notifications.find({ email : req.session.name }, function(err, notifications) {
        if (err) {
            console.log('Error getting notifications');
        } else {
            notifications.forEach(element => {
                if (element.read === false) {
                    element.read = true;
                    element.save(() => {});
                }
            });
            console.log('updated all notifications to read');
        }
    });
});

router.get('/', (req, res) => {
    models.notifications.find({ email : req.session.name, read: false }, function(err, count){
        res.json(count.length);
    });
});

router.post('/', (req, res) => {
    models.notifications.find({ 'email' : req.session.name }, function(err,notif) {
        let oldNotifs = new Array;
        let newNotifs = new Array;
        notif.forEach(element => {
            if (element.read === true)
                oldNotifs.push(element);
            else
                newNotifs.push(element);
        });
        res.json({new: newNotifs, old: oldNotifs});
    })
});

module.exports = router;