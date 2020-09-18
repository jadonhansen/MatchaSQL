const express = require('express');
const router = express.Router();
const Models = require('../models/models');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

router.get('/', function(req, res) {
    if(!req.session.name) {
        res.render('oops', {error: '2'});
    } else {
        // render search page with current users tags (need them for the ui)
        Models.user.findOne({email : req.session.name}, { tags : 1 }, function(err, currUser) {
            if (err) {
                console.log('getting error finding user - search: ', err);
            }
            res.render('search', { 'tags' : currUser.tags });
        });
    }
});

router.post('/fetchResults', bodyParser.urlencoded({extended: true}), function(req, res) {
    // check if authorized
    if(!req.session.name) {
        return(res.render('oops', {error: '2'}));
    }
    else {
        console.log('advanced search param: ', req.body);
        let sessionUser = new Array;

        // check if advanced params were actually sent
        if (req.body.advanced_search == 1 && !req.body.age && !req.body.location && !req.body.color && !req.body.rating) {
            req.body.advanced_search = null;
        }

        // find current user to compare with then find all other verified users to compare with
        Models.user.findOne({email: req.session.name}, { 'contacts' : 0, 'viewed' : 0, 'views' : 0, 'liked' : 0, 'likes' : 0, 'blocked' : 0, 'reports' : 0,
        'password' : 0, 'status' : 0, 'image_one' : 0, 'image_two' : 0, 'image_three' : 0, 'image_four' : 0, 'verif' : 0, 'verif_email' : 0}, function(err, currUser) {

            Models.user.find({isverified: true},  { 'contacts' : 0, 'viewed' : 0, 'views' : 0, 'liked' : 0, 'likes' : 0, 'blocked' : 0, 'reports' : 0,
            'password' : 0, 'status' : 0, 'image_one' : 0, 'image_two' : 0, 'image_three' : 0, 'image_four' : 0, 'verif' : 0, 'verif_email' : 0}, function(err, users) {
    
                if (err) {
                        console.log('Error finding users for search: ', err);
                } else {
                    let i = 0;
                    while (users[i]) {
                        while (users[i]) {
                            // BY CURRENT USER PREFERENCES
                            // if user is me
                            if (users[i].email == req.session.name) {
                                sessionUser = users[i];
                                console.log('removed self: ', users[i].username);
                                users.splice(i, 1);
                                break;
                            }
                            // if theyre not a women and im into women
                            if (currUser.prefferances == 'Female') {
                                if (users[i].gender != 'Female') {
                                    console.log('removed non-female user: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                            }
                            // if theyre not a man and im into men
                            if (currUser.prefferances == 'Male') {
                                if (users[i].gender != 'Male') {
                                    console.log('removed non-male user: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                            }
                            // BY OTHER USERS PREFERENCES
                            // if theyre not other and im into other
                            if (users[i].prefferances != 'Bi-Sexual') {
                                if (currUser.gender == 'Other') {
                                    console.log('removed non-bi-sexual user: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                            }
                            // if theyre into men and im not a man
                            if (users[i].prefferances == 'Male') {
                                if (currUser.gender != 'Male') {
                                    console.log('removed man whos into men: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                            }
                            // if theyre into women and im not a women
                            if (users[i].prefferances == 'Female') {
                                if (currUser.gender != 'Female') {
                                    console.log('removed woman whos into women: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                            }
                            // REQUIRED FILTERING
                            // automatic fame filter - removes users with a rating bigger than yours
                            if (!req.body.advanced_search && !req.body.rating) {
                                if (users[i].fame > currUser.fame) {
                                    console.log('removed larger fame rated users: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                            }
                            // automatic location filter
                            if (!req.body.advanced_search && !req.body.location) {
                                if (users[i].location) {
                                    let myCity = currUser.location.split(',');
                                    if (!users[i].location.includes(myCity[0].trim())) {
                                        console.log('removed users with a different city: ', users[i].username);
                                        users.splice(i, 1);
                                        break;
                                    }
                                } else {
                                    console.log('removed users with no location: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                            }
                            // automatic tag filter - removes user that doesn't have at least one tag in common
                            if (!req.body.advanced_search && !req.body.color) {
                                let match = false;
                                let a = 0;
                                while (currUser.tags[a]) {
                                    if (users[i].tags && users[i].tags.includes(currUser.tags[a])) {
                                        match = true;
                                    }
                                    a++;
                                }
                                if (match !== true) {
                                    console.log('removed user with not one matched tag: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                            }
                            // // if theyre blocked by me
                            // if (currUser.blocked && currUser.blocked.includes(users[i].email)) {
                            //     console.log('removed blocked users by me: ', users[i].username);
                            //     users.splice(i, 1);
                            //     break;
                            // }

                            // ADVANCED FILTERS BELOW
                            if (req.body.advanced_search) {
                                // advanced age gap search - user age must be within the determined gap, bigger or smaller
                                const ageGap = req.body.age;
                                const fameGap = req.body.rating;
                                if (req.body.age && ((users[i].age > currUser.age + ageGap) || (users[i].age < currUser.age - ageGap))) {
                                    console.log('removed user not in age gap: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                                // advanced fame gap search - user fame must be within the determined gap, bigger or smaller
                                if (req.body.rating && ((users[i].fame < currUser.fame - fameGap) || (users[i].fame > currUser.fame + fameGap))) {
                                    console.log('removed user not in fame gap: ', users[i].username);
                                    users.splice(i, 1);
                                    break;
                                }
                                // advanced location search - users location must contain the sent string
                                if (req.body.location) {
                                    if (users[i].location) {
                                        if (!users[i].location.includes(req.body.location)) {
                                            console.log('removed users with a different location: ', users[i].username);
                                            users.splice(i, 1);
                                            break;
                                        }
                                    } else {
                                        console.log('removed users with no location: ', users[i].username);
                                        users.splice(i, 1);
                                        break;
                                    }
                                }
                                // advanced tag search - must match all tags that were sent in array
                                if (req.body.color) {
                                    let a = 0;
                                    while (req.body.color[a]) {
                                        if (users[i].tags && users[i].tags.includes(req.body.color[a]))
                                            a++;
                                        else {
                                            console.log('removed user with no similiar tag: ', users[i].username);
                                            users.splice(i, 1);
                                            break;
                                        }
                                    }
                                    if (req.body.color[a]) {
                                        a = 0;
                                        break;
                                    }
                                    a = 0;
                                }
                            }
                            i++;
                        }
                    }
                }
                res.json({ 'matches': users, 'tags' : currUser.tags, 'currUser' : sessionUser });
            });
        });
    }
});

//export this router to use in our index.js
module.exports = router;