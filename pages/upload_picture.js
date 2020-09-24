const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs-extra')
const multer = require('multer');
const Updates = require('../database/db_updates');
const upload = multer({limits: {fileSize: 6000000},
                        dest: process.env.path});

router.post('/', upload.single('picture'), bodyParser.urlencoded({extended: true}), function (req, res) {
    if (req.file == null) {
        console.log('No File Recieved');
        res.redirect('/profile');
    } else if (req.session.name) {
        // reads the img file from tmp in-memory location
        let newImg = fs.readFileSync(req.file.path);
        // encodes the file as a base64 string
        let encImg = newImg.toString('base64');

        let db = new Updates();
        if (req.body.main_save == '') {
            let outcome = db.uploadImages(req.session.name, encImg, 0);

            outcome.then(function (success) {
                console.log('Saved Main Image');
                db.close();
            }, function (err) {
                console.log('Error Saving Main Image');
                db.close();
            });
        }
        if (req.body.two_save == '') {
            let outcome = db.uploadImages(req.session.name, encImg, 1);

            outcome.then(function (success) {
                console.log('Saved Image: One');
                db.close();
            }, function (err) {
                console.log('Error Saving Image: One');
                db.close();
            });
        }
        if (req.body.three_save == '') {
            let outcome = db.uploadImages(req.session.name, encImg, 2);

            outcome.then(function (success) {
                console.log('Saved Image: Two');
                db.close();
            }, function (err) {
                console.log('Error Saving Image: Two');
                db.close();
            });
        }         
        if (req.body.four_save == '') {
            let outcome = db.uploadImages(req.session.name, encImg, 3);

            outcome.then(function (success) {
                console.log('Saved Image: Three');
                db.close();
            }, function (err) {
                console.log('Error Saving Image: Three');
                db.close();
            });
        }
        if (req.body.five_save == '') {
            let outcome = db.uploadImages(req.session.name, encImg, 4);

            outcome.then(function (success) {
                console.log('Saved Image: Four');
                db.close();
            }, function (err) {
                console.log('Error Saving Image: Four');
                db.close();
            });
        }
        res.redirect('/profile');
    } else {
        res.render('oops', { error: '2' });
    }
});

module.exports = router;