# Matcha
Matcha is a recreation of the popular dating app, Tinder, except with Matcha we find your ideal match with a user filtering system using your preferences that are fully customizable on the fly. You'll find our built-in chat feature
quite refreshing to use with your match!

#### Grade Achieved: 100 / 125 [No Bonus marks]

## Technologies:
- MAMP
- MySQL
- HTML
- CSS
- JavaScript
- AJAX

## Requirements:
- npm
- MAMP, for the MySQL server
- Most other Node requirements can be found in the `package.json` file

## Developer Setup:
1. [Install MAMP](https://www.mamp.info/en/downloads/)
2. Run the MAMP server, no configuration necessary, we are simply using the pre-configured SQL server.
3. Configure an `.env` file in the project root directory:
	- `port=3306`
	- `secret=128936GS71gd92JKJAF3701237`
	- `path=path/to/MatchaSQL/uploads/` < Ensure this path is correct
	- `TOKEN= ` < IPInfo token for IP tracking (this will require a free [IPInfo account](https://ipinfo.io/))
	- `smtp= ` < gmail account for sending emails
	- `password= `< gmail account password
4. In the project root directory, run `npm install`, followed by `npm start`
5. Navigate to `localhost:3306` in your browser, create and verify your account, and get matching!

## Architecture:
Stuff

## Testing:
The [Marking Sheet](https://github.com/wethinkcode-students/corrections_42_curriculum/blob/master/matcha.markingsheet.pdf) will be used as a testing outline. A more simplified Outline and Expected Outcomes are listed below.

#### Outline:
1. Launch Web Server
2. Create Account
3. Verify Account & Login
4. Edit Profile
5. View Suggestions
6. Search / Filter
7. Geolocation
8. Popularity Rating
9. Notifications
10. View another Profile
11. Like / Unlike other users
12. Block users
13. Live Messaging

#### Expected Outcomes:
1. The backend server should start up and connect to the SQL database
2. You should be able to create an account
3. You should be able to verify the account via the received email, and then login
4. You should be able to edit a number of fields on your profile
5. You should be able to view other suggested profiles that match your preferences
6. You should be able to search and filter through a list of other profiles
7. Geolocation should be a feature.
8. Popularity ratings should be displayed on profiles
9. You should receive notifications when certain events happen
10. You should be able to view other profiles
11. You should be able to Like or Unlike other users
12. You should be able to block another user
13. You should be able to live chat with another user once you have both liked one another

---

## Error Codes (for developer use):
- 1 - Please make sure your login details are correct. Try again!
- 2 - Access Denied! Please login first.
- 3 - Either we are having server downtime or something went wrong client side :/
- 4 - Please check your email for the link we have sent you.
- 5 - Please make sure you fill out all inputs and use a unique email address and username.
- 6 - Please make sure your account has been verified by using the link sent to your email.
- 7 - Please use the link in the email sent to you to verify your account.
- 8 - Please make sure both passwords are the same.
- 9 - This email address is already registered with a Matcha account.  (updating profile)
- 10 - This username is already registered with a Matcha account. (updating profile)
- 11 - Please make sure you fill out the email input.
- 13 - Your password must be at least 8 characters long and must not contain spaces.
- 14 - Either your account has not been verified or we cannot find your email address related to an existing account.