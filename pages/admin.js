const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Admin = require('../database/db_admin');

// deleting reports
router.post('/delete', bodyParser.urlencoded({extended: true}), function(req, res) {

	let db = new Admin();

	let admin = db.isAdmin(req.session.name);
	admin.then( function (success) {

		let del = db.delReport(req.body.username);
		del.then( function (success) {

			res.redirect('/admin');
		}, function (err) {
			console.log(err);
			db.close();
			res.render('oops', {error : '3'});
		});
	}, function (err) {
		console.log(err);
		db.close();
		res.render('oops', {error : '15'});
	});
});

// deleting blocks
router.post('/dismiss', bodyParser.urlencoded({extended: true}), function(req, res) {

	let db = new Admin();

	let admin = db.isAdmin(req.session.name);
	admin.then( function (success) {

		let del = db.delBlock(req.body.username);
		del.then( function (success) {

			res.redirect('/admin');
		}, function (err) {
			console.log(err);
			db.close();
			res.render('oops', {error : '3'});
		});
	}, function (err) {
		console.log(err);
		db.close();
		res.render('oops', {error : '15'});
	});
});

router.get('/', function(req, res) {

	let db = new Admin();

	let admin = db.isAdmin(req.session.name);
	admin.then( function (success) {

		let ret = db.getBlockAndReports();
		ret.then( function (data) {
			db.close();
			res.render('admin', {'blocks' : data.blocks, 'reports' : data.reports});
		}, function (err) {
			console.log(err);
			db.close();
			res.render('oops', {error : '3'});
		});
	}, function (err) {
		console.log(err);
		db.close();
		res.render('oops', {error : '15'});
	});
});

module.exports = router;