const bodyParser = require('body-parser');
const models = require('../models/models');
const express = require('express');
const router = express.Router();

router.post('/data', bodyParser.urlencoded({extended: true}), (req, res) => {
  models.messages.find({'from': req.session.name, 'to': req.body.email}, function(err, sent){
      models.messages.find({'to': req.session.name, 'from': req.body.email}, function(err, received){
          let thing = new Array;
          thing.splice(0, 0, sent);
          thing.splice(1,0, received);
          res.json(thing);
      });
  });
});

// rendering chat page
router.post('/', bodyParser.urlencoded({ extended: true }), function (req, res) {
  if (!req.session.name)
    res.render('oops', { error: '2' });
  else {
    console.log('chat page req: ', req.body);

    models.user.findOne({ email : req.session.name }, { username : 1, email : 1 }, function (err, doc) {
      models.user.findOne({ _id : req.body.id }, { username : 1, email : 1 }, function (err, chatter) {

        if (req.body.sendMsg == 'sendMessage') {
          // save message to chat
          let roughDate = new Date();
          let newDate = roughDate.toLocaleTimeString() + ' ' + roughDate.toLocaleDateString();
          const message = new models.messages({
            message: req.body.message,
            to: chatter.email,
            from: doc.email,
            time: newDate,
            sort_time: roughDate.getTime(),
            read: false
          });
          message.save(function (err) {
            if (err)
              console.log('Error saving message: ', err);
            else
              console.log('updated chat messages');
          });

          res.render('chat', { 'username': chatter.username, 'id': chatter._id, 'email': chatter.email });

          // finding current user and putting friend user's email in contacts
          models.user.findOneAndUpdate({ 'email': req.session.name }, { $addToSet: { 'contacts': chatter.email } }, function (err, contacts) {
            if (err) {
              console.log('could not update logged in user contacts - chats: ', err);
            } else {
              console.log('updated logged in user contacts - chats');
            }
          });
          // finding friend user and putting current user's email in contacts
          models.user.findOneAndUpdate({ '_id': req.body.id }, { $addToSet: { 'contacts': doc.email } }, function (err, temp) {
            if (err) {
              console.log('could not update chatters contacts - chats: ', err);
            } else {
              console.log('updated chatters contacts - chats');
            }
          });

          // new message notification
          const notif = new models.notifications({
            email: chatter.email,
            name: 'new message from: ' + doc.username,
            content: req.body.message,
            time: newDate,
            read: false
          });
          notif.save(function (err) {
            if (err)
              console.log('Error saving message notif: ', err);
            else
              console.log('updated notification for new message');
          });
        } else {
          res.render('chat', { 'username': chatter.username, 'id': chatter._id, 'email': chatter.email });
        }
      });
    });
  }
});

module.exports = router;