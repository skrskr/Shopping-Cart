const passport = require('passport');
const User = require('../models/user_model');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
})

// Sign In middleware
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({'email': email}, function (err, user) {
        if(err)
            return done(err);
        if(!user)
            return done(null, false, {message: "Email not found"})
        
        if(!user.validatePassword(password))
            return done(null, false, {message: "Password invalid"});
        
        return done(null, user);
    })
}));

// Sign Up middleware
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({'email': email}, function (err, user) {
        if(err)
            return done(err);
        if(user)
            return done(null, false, {message: "Email already in user"})
        
        let newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        newUser.save((err, result) => { 
            if(err)
                return done(err);
            
            return done(null, newUser)
        })
    })
}));
