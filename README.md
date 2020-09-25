# Matcha
Matcha is a recreation of the popular dating app, Tinder, except with Matcha we find your ideal match with a user filtering system using your prefferances that is fully customizable on the fly. You'll find our built-in chat feature
quite refreshing to use with your match!

# How to use
- A .env file with various constants will be needed to run this application properly:
	1. port=3306
	2. secret=128936GS71gd92JKJAF3701237
	3. path= path to the root directory/MatchaSQL/uploads/
	4. TOKEN= IPInfo token for IP tracking (this will require a free IPInfo account)
- In the root project directory in your terminal run the command 'npm install'.
- In the same directory run the command 'npm start'.
- Make sure you have MAMP running for a connection to the SQL database - all config constants are found in database/config.js.
- Then navigate to 'localhost:3306' in your browser.
- Happy Matching!

# Error Codes (for developer use):
- 1: Please make sure your login details are correct. Try again!
- 2: Access Denied! Please login first.
- 3: Either we are having server downtime or something went wrong client side :/
- 4: Please check your email for the link we have sent you.
- 5: Please make sure you fill out all inputs and use a unique email address and username.
- 6: Please make sure your account has been verified by using the link sent to your email.
- 7: Please use the link in the email sent to you to verify your account.
- 8: Please make sure both passwords are the same.
- 9: This email address is already registered with a Matcha account.  (updating profile)
- 10: This username is already registered with a Matcha account. (updating profile)
- 11: Please make sure you fill out the email input.
- 13: Your password must be at least 8 characters long and must not contain spaces.
- 14: Either your account has not been verified or we cannot find your email address related to an existing account.