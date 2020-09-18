// App Variables
const express   = require('express');
const app       = require('express')();
const mongoose  = require('mongoose');
const path      = require('path');
const session   = require('express-session');
const http      = require('http').createServer(app);

// App Configuration
require('dotenv').config()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(session({secret: process.env.secret, resave: true, saveUninitialized: true}));
app.use(express.static('public'));
app.use('/js', express.static('views/js'));
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb+srv://gstrauss:' + process.env.password +'@matcha-ch0yb.gcp.mongodb.net/shell?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Server Activation
http.listen(process.env.port, function(){
  console.log(`listening on port: ${process.env.port}`);
});

// Page Variables
var index               = require('./pages/index.js');
var home                = require('./pages/home.js');
var login               = require('./pages/login.js');
var create              = require('./pages/create.js');
var forgot_password     = require('./pages/forgot_password.js');
var reset_password      = require('./pages/reset_password.js');
var user_confirm        = require('./pages/user_confirm.js');
var logout              = require('./pages/logout.js');
var profile             = require('./pages/profile.js');
var update_profile      = require('./pages/update_profile.js');
var email_update        = require('./pages/email_update.js');
var add_tag             = require('./pages/add_tag.js');
var upload_picture      = require('./pages/upload_picture.js');
var notifications       = require('./pages/notifications.js');
var search              = require('./pages/search.js');
var contacts            = require('./pages/contacts.js');
var matched_profile     = require('./pages/matched_profile.js');
var chat                = require('./pages/chat.js');
var remove_tag          = require('./pages/remove_tag.js');
var oops                = require('./pages/oops.js');
var live_notifications  = require('./pages/live_notifications.js')

/*
* Page Routing
*/

app.use('/', index);
app.use('/home', home);
app.use('/login', login);
app.use('/create', create);
app.use('/chat', chat);
app.use('/forgot_password', forgot_password);
app.use('/contacts', contacts);
app.use('/matched_profile', matched_profile);
app.use('/notifications', notifications);
app.use('/profile', profile);
app.use('/search', search);
app.use('/add_tag', add_tag);
app.use('/logout', logout);
app.use('/update_profile', update_profile);
app.use('/reset_password', reset_password);
app.use('/upload_picture', upload_picture);
app.use('/check/:var_words', email_update); // this is not in use
app.use('/live_notifications', live_notifications);
app.use('/:var_words', user_confirm);
app.use('/remove_tag', remove_tag);
app.use('/oops', oops);