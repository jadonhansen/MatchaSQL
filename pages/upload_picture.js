const express = require('express');
const router = express.Router();
const Models = require('../models/models');
const bodyParser = require('body-parser');

ObjectId = require('mongodb').ObjectId
fs = require('fs-extra')

multer = require('multer')
util = require('util')
upload = multer({limits: {fileSize: 2000000 }, dest:process.env.path})

router.post('/', upload.single('picture'), bodyParser.urlencoded({extended: true}), function (req, res) {
    if (req.file == null) {
        console.log('received no file from the front end upload picture');
        res.redirect('/profile');
    }
    if (req.session.name) {
        // reads the img file from tmp in-memory location
        var newImg = fs.readFileSync(req.file.path);
        // encodes the file as a base64 string
        var encImg = newImg.toString('base64');
        if(req.body.main_save == '')
        {
            Models.user.findOneAndUpdate({email: req.session.name}, {main_image: encImg}, function(err, val){
                console.log('saved main image');
            });
        }
        if(req.body.two_save == '')
        {
            Models.user.findOneAndUpdate({email: req.session.name}, {image_one: encImg}, function(err, val){
                console.log('saved first image');
            });
        }
        if(req.body.three_save == '')
        {
            Models.user.findOneAndUpdate({email: req.session.name}, {image_two: encImg}, function(err, val){
                console.log('saved second image');
            });
        }         
        if(req.body.four_save == '')
        {
            console.log('big test');
            Models.user.findOneAndUpdate({email: req.session.name}, {image_three: encImg}, function(err, val){
                console.log('saved third image');
            });
        }
        if(req.body.five_save == '')
        {
            console.log('big test');
            Models.user.findOneAndUpdate({email: req.session.name}, {image_four: encImg}, function(err, val){
                console.log('saved fourth image');
            });
        }
        res.redirect('/profile');
    } else {
        res.render('oops', { error: '2' });
    }
});

module.exports = router;