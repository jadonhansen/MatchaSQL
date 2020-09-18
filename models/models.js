const mongoose = require('mongoose');
const db = mongoose.connection;

var userSchema = new mongoose.Schema({
   name: String,
   username: String,
   bio: String,
   surname: String,
   email: String,
   verif_email: String,
   age: String,
   gender: String,
   prefferances: String,
   fame_rating: String,
   password: String,
   verif: String,
   isverified: { type: Boolean, default: false },
   fame: Number,
   status: String,
   location: String,
   location_status: String,
   main_image: String,
   image_one: String, 
   image_two: String,
   image_three: String,
   image_four: String,
   connected: String,
   contacts: [{
      type: String
   }],
   viewed: [{
      type: String
   }],
   views: [{
      type: String
   }],
   reports: [{
      type: Object
   }],
   tags: [{
      type: String
   }],
   likes: [{
      type: String
   }],
   liked: [{
      type: String
   }],
   blocked: [{
      type: String
   }]
});

var notificationsSchema = new mongoose.Schema({
   email: String,
   name: String,
   content: String,
   time: String,
   read: Boolean
})

var messagesSchema = new mongoose.Schema({
   message: String,
   to: String,
   from: String,
   time: String,
   sort_time: Number,
   read: Boolean
});

db.on('error', console.error.bind(console, 'Connection error:'));
// Once the database connection has succeeded, the code in db.once is executed.
db.once('open', function(callback) {
   console.log('Connected to MongoDB');
});

// This creates the Bug model
var user = mongoose.model('users', userSchema);
var notifications = mongoose.model('notifications', notificationsSchema);
var messages = mongoose.model('messages', messagesSchema);

module.exports.user = user;
module.exports.notifications = notifications;
module.exports.messages = messages;