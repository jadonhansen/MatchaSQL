// App Variables
const express   = require('express');
const app       = express();
const path      = require('path');
const session   = require('express-session');

// App Configuration
require('dotenv').config();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use('/js', express.static('views/js'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
		expires: 600000000
  }
}));

// Page Variables
const index               = require('./pages/index.js');
const home                = require('./pages/home.js');
const login               = require('./pages/login.js');
const create              = require('./pages/create.js');
const forgot_password     = require('./pages/forgot_password.js');
const reset_password      = require('./pages/reset_password.js');
const user_confirm        = require('./pages/user_confirm.js');
const logout              = require('./pages/logout.js');
const profile             = require('./pages/profile.js');
const update_profile      = require('./pages/update_profile.js');
const email_update        = require('./pages/email_update.js');
const upload_picture      = require('./pages/upload_picture.js');
const notifications       = require('./pages/notifications.js');
const search              = require('./pages/search.js');
const contacts            = require('./pages/contacts.js');
const matched_profile     = require('./pages/matched_profile.js');
const chat                = require('./pages/chat.js');
const tags                = require('./pages/tags.js');
const oops                = require('./pages/oops.js');
const live_notifications  = require('./pages/live_notifications.js')

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
app.use('/tags', tags);
app.use('/logout', logout);
app.use('/update_profile', update_profile);
app.use('/reset_password', reset_password);
app.use('/upload_picture', upload_picture);
app.use('/check/:var_words', email_update); // this is not in use
app.use('/live_notifications', live_notifications);
app.use('/:var_words', user_confirm);
app.use('/oops', oops);

module.exports = app;