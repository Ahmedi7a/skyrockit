require('dotenv').config();
require('./config/database')
const express = require("express");
const methodOverride = require("method-override"); // new
const app = express();
const session = require('express-session');// for session
const MongoStore = require('connect-mongo');// to store session in mongo
const morgan = require('morgan');
const path = require("path");
const isSignedIn = require('./middelware/is-signed-in.js')
const passUserToView=require('./middelware/pass-user-to-veiw.js')

//models
const User = require("./models/user");


//middleware
app.use(morgan('dev'));
// need to put it to read the body in form
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); //css
//session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 7 * 24 * 60 * 60 // 1 week in seconds
        }),
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in millesecond
            httpOnly: true,
            secure: false,
        }
    })
);

app.use(passUserToView);
//====================================================
//import controller
const authCotroller = require('./controllers/authentication.js');
const appController = require('./controllers/applications.js');

//==================================================
// auth routs
//home page
app.get('/', authCotroller.home);

//signup page
app.get('/auth/sign-up', authCotroller.signUp)

//post sign up
app.post('/auth/sign-up', authCotroller.addUser)

//sign in page
app.get('/auth/sign-in', authCotroller.signInForm)

//sign in post
app.post('/auth/sign-in', authCotroller.signIn)

//sign out page and kill session
app.get('/auth/sign-out', authCotroller.signOut);

app.use(isSignedIn); // so after this the user has be signed in
//vip
// app.get('/vip-lounge', isSignedIn, authCotroller.welcome)
//=============================================================
//app routes:

// id: 67a1c05e3261b54e887e5abb

//add page
app.get('/users/:userId/applications/new',appController.newApplication); //view new app form
//post new app
app.post('/users/:userId/applications',appController.createApplication);

//show all apps
app.get('/users/:userId/applications',appController.index);

//show more
app.get('/users/:userId/applications/:applicationId',appController.show);

//delete the app
app.delete('/users/:userId/applications/:applicationId', appController.deleteApplication)






//=============================================
app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000");
});