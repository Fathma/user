# User rest API 

1. User Registration 
	1.1 Email verification using totp
	1.2 saving image using multer
	1.3 Password encryption using bcrypt
	1.4 backend validation using joi
 
 2. Signup with facebook using passport-facebook
 3. Sign uo with google using passport-google-oauth2
 
 4. User login
    4.1 Backend validation check using joi
    4.2 User authentication check using passport-local
    4.3 send jwt token as response
    
 5. Change password 
    5.1 sends an url to user email containing a jwt token
    5.2 varifies the jwt token and send s the feed back which will provide a page with new password field
    5.3 updates the new password with back end validation
    
 6. list of users with user passport-jwt authentication
 7. update user info with user passport-jwt authentication
 8. single user view with user passport-jwt authentication
 
 



