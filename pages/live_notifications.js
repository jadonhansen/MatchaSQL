const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const Database = require('../database/db_queries');

router.post('/remove_notif', bodyParser.urlencoded({ extended: true }), (req, res) => {

    let db = new Database();

    let sql = "DELETE FROM notifications WHERE msgID = ?";
    let inserts = [req.body.id];
    sql = mysql.format(sql, inserts);
    let notifs = db.query(sql);

    notifs.then(function (ret) {
        db.close();
        console.log('Deleted Notification');
    }, function (err) {
        console.log('Error Deleting Notifications');
        db.close();
    });
});

router.get('/update_read', (req, res) => {

    let db = new Database();

    let sql = "UPDATE notifications SET readNotif = ? WHERE username = ?";
    let inserts = [1, req.session.name];
    sql = mysql.format(sql, inserts);
    let notifs = db.query(sql);

    notifs.then(function (ret) {
        db.close();
        console.log('Updated All Notifications To Read');
    }, function (err) {
        db.close();
        console.log('Error Updating All Notifications To Read');
    });
});

router.get('/', (req, res) => {

    let db = new Database();

    let sql = "SELECT * FROM notifications WHERE username = ?";
    let inserts = [req.session.name];
    sql = mysql.format(sql, inserts);
    let notifs = db.query(sql);

    notifs.then(function (ret) {
        db.close();
        res.json(ret.length);
    }, function (err) {
        db.close();
        res.json(0);
    });
});

router.post('/', (req, res) => {

    let db = new Database();

    let sql = "SELECT * FROM notifications WHERE username = ?";
    let inserts = [req.session.name];
    sql = mysql.format(sql, inserts);
    let notifs = db.query(sql);

    notifs.then(function (notif) {
        let oldNotifs = new Array;
        let newNotifs = new Array;
        notif.forEach(element => {
            if (element.readNotif === 1)
                oldNotifs.push(element);
            else
                newNotifs.push(element);
        });
        db.close();
        res.json({new: newNotifs, old: oldNotifs});
    }, function (err) {
        db.close();
        res.json({new: newNotifs, old: oldNotifs});
    });
});

module.exports = router;