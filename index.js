const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
require("./auth");

function isLoggedIn(req,res,next){
    // if(req.isAuthenticated()){
    //     return next();
    // }
    // res.redirect("/auth/google");
    req.user ? next() : res.sendStatus(401);
}

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname,'client')));

app.get('/',(req,res) => {
    res.sendFile("C:\\Users\\User\\Documents\\NodeJS_project\\Express_project\\google_auth\\index.html");
});

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/failure',(req,res) => {
    res.send("Something went wrong");
});

app.get('/auth/protected',isLoggedIn,(req,res) => {
    let name = req.user.displayName;
    res.send(`Hello ${name}`);
});

app.listen(5000,() => {
    console.log("Listening on port 5000");
});