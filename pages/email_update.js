const express = require('express');
const Database = require('../database/db_queries');
const router = express.Router();
const mysql = require('mysql');

router.get('/', function(req, res){
    let check = req.originalUrl.substring(7);

    let db = new Database();

    let sql = "SELECT * FROM users where verif = ?";
    let inserts = [check];
    sql = mysql.format(sql, inserts);
    let user = db.query(sql);

    user.then(function (ret) {
        if (ret[0]) {
            let updatedUsr = db.updateNewEmailByVerif(check, ret[0].verif_email);

            updatedUsr.then(function (success) {
                console.log('Updated To New Email');
                res.redirect('/login');
                db.close();
            }, function (err) {
                console.log('Unable To Update To New Email');
                res.render('oops', {error: '3'})
                db.close();
            });
        }
    }, function (err) {
        console.log('Unable To Update To New Email - Verif Not Found');
        res.render('oops', {error: '3'})
        db.close();
    });
});

module.exports = router;