const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const Database = require('../database/db_queries');
const mysql = require('mysql');

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

            let hash = encrypt.cryptPassword(req.body.password);

            hash.then(function (hashPass) {
                db = new Database();
                let sql = "UPDATE users set password = ? WHERE verif = ?";
                let inserts = [hashPass, req.body.url];
                sql = mysql.format(sql, inserts);
                let user = db.query(sql);
    
                user.then(function (result) {
                    if (result[0]) {
                        console.log('succesful password reset');
                        res.redirect('login');
                    }
                },
                    function (err) {
                        res.render('oops', { error : '3' });
               });
            });

        } else {
            res.render('oops', {error : '13'});
        }
    }
    else
        res.render('oops', {error: '8'});
})

module.exports = router;