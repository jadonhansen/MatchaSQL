const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Searches = require('../database/db_searches');
const app = express();
app.use(bodyParser.json());

router.get('/', function(req, res) {
    if(!req.session.name) res.render('oops', {error: '2'});
    else {
        let db = new Searches();

        let tags = db.getUserTags(req.session.name);

        tags.then(function (ret) {
            res.render('search', { 'tags' : ret });
            db.close();
        }, function (err) {
            reject("Failed to validate query.");
            db.close();
        });
    }
});

router.post('/fetchResults', bodyParser.urlencoded({extended: true}), function(req, res) {
    if (!req.session.name) return(res.render('oops', {error: '2'}));

    console.log('Advanced Search Param: ', req.body);
    let sessionUser = new Array;

    // check if advanced params were actually sent
    if (req.body.advanced_search == 1 && !req.body.age && !req.body.location && !req.body.color && !req.body.rating) {
        req.body.advanced_search = null;
    }

    let db = new Searches();
    let tags = db.getUserTags(req.session.name);

    tags.then(function (tagArray) {
        let user = db.getUserSpecs(req.session.name);

        user.then(function (currUser) {
            let usrsArr = db.getAllUsers();

            usrsArr.then(async function (users) {

                let i = 0;
                while (users[i]) {
                    console.log(users[i].username);
                    while (users[i]) {
                        // BY CURRENT USER PREFERENCES
                        // if user is me
                        if (users[i].username == req.session.name) {
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
                        // automatic blocking filter
                        if (users[i].username) {
                            let match = false;
                            let DB = new Searches();
                            let outcome = DB.inBlockList(users[i].username, currUser.username);

                            await outcome.then(function (success) {
                                match = false;
                                DB.close();
                            }, function (err) {
                                match = true;
                                if (err == 'Unable To Scan Block List') console.log(err);
                                DB.close();
                            });
                            if (match !== true) {
                                console.log('removed user who is in blocked list: ', users[i].username);
                                users.splice(i, 1);
                                break;
                            }
                        }
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
                            //fetch user tags to compare with
                            let userTags = db.getUserTags(users[i].username);
                            let match = false;

                            await userTags.then(function (usrTags) {
                                let a = 0;
                                if (!usrTags[0]) match = true;
                                else {
                                    while (tagArray[a]) {
                                        if (usrTags && usrTags.includes(tagArray[a])) {
                                            match = true;
                                            break;
                                        }
                                        a++;
                                    }
                                }
                            }, function (err) {
                                console.log('Tags: ', err);
                            });
                            if (match !== true) {
                                console.log('removed user with no matched tags: ', users[i].username);
                                users.splice(i, 1);
                                break;
                            }
                        }                        

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
                                let usrTags = db.getUserTags(users[i].username);
                                let a = 0;

                                await usrTags.then(function (userTags) {
                                    while (req.body.color[a]) {
                                        if (userTags && userTags.includes(req.body.color[a]))
                                            a++;
                                        else {
                                            console.log('removed user with no similiar tag: ', users[i].username);
                                            users.splice(i, 1);
                                            break;
                                        }
                                    }
                                });
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
                res.json({ 'matches': users, 'tags' : tagArray, 'currUser' : sessionUser });
            }, function (err) {
                reject(err);
                res.render('oops', {error: '3'});
                db.close();
            });
        }, function (err) {
            reject(err);
            res.render('oops', {error: '3'});
            db.close();
        });
    }, function (err) {
        reject(err);
        res.render('oops', {error: '3'});
        db.close();
    });
});

module.exports = router;