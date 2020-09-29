const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const Chats = require('../database/db_chats');

router.post('/data', bodyParser.urlencoded({extended: true}), (req, res) => {

  let db = new Chats();
  let ret = db.getMessages(req.body.email, req.session.name);

  ret.then(function (arr) {
    res.json(arr);
    db.close();
  }, function (err) {
    console.log(err);
    db.close();
    res.render('oops', {error: '3'});
  });
});

// rendering chat page
router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {
  if (!req.session.name) res.render('oops', { error: '2' });
  else {
    if (req.body.sendMsg == 'sendMessage') {
      let db = new Chats();
      let ret = db.sendMessage(req.body.id, req.session.name, req.body.message);

      ret.then(function (chatter) {
        db.close();
        res.render('chat', { 'username': chatter.username, 'id': chatter.userID, 'email': chatter.email });
      }, function (err) {
        db.close();
        console.log(err);
        res.render('oops', {error : '3'});
      });
    } else {
      let db = new Chats();
      let ret = db.renderChat(req.body.id);

      ret.then(function (details) {
        db.close();
        res.render('chat', { 'username': details.username, 'id': details.userID, 'email': details.email });
      }, function (err) {
        db.close();
        console.log(err);
        res.render('oops', {error: '3'});
      });
    }
  }
});

module.exports = router;