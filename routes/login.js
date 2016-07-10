var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost/samsblog');

var User = require('../models/user');

// Check if user is already authenticated and redirect
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		req.flash('success', 'You are already logged in');
		if(req.user.username === 'admin'){
			res.redirect('/admin');
		} else {
			res.redirect('/users/home');
		}
	} else {
		res.render('login');
	}
	res.render('login');
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new localStrategy(function(username, password, done){
	// Checking if there's a user if not throw error. getUserByUsername is a function that we created using mongoose query functions(in models)
	// we are using this function instead of the default in the passport docs
	// mongoose will fetch user.
	User.getUserByUsername(username, function(err, user){
		if (err) throw err;
		if (!user){
			return done(null, false, {message: 'Unknown User'});
		}
		
		// Getting user password and checking
		// comparePassword is a custom function we built using bcryptjs since passport doesnt have encryption
		// isMatch is the reponse(true or false). The rest of the if else code comes from passport docs.
		// comparePassword 3rd param is a callback which we've modified to use bcrypt by passing original passport code in it.
		User.comparePassword(password, user.password, function(error, isMatch){
			if(err) return done(err);
			if(isMatch){
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid Password'});
			}
		});
	});
}));

router.post('/', function(req, res, next) {
	passport.authenticate('local', function(err, user, info){
		if (err) throw err;

		var username = req.body.username;
		var password = req.body.password;

		req.checkBody('username', 'Please enter a username').notEmpty();
		req.checkBody('password', 'Please enter a password').notEmpty();

		var errors = req.validationErrors();

		if (errors) {
			res.render('login', {errors: errors})
		} else {
				if(!user){
					req.flash('error', 'Username or password invalid.');
					res.redirect('/login');
				}
				if(user.suspended){
					req.flash('error', 'Account suspended.');
					res.redirect('/login');
				} 
			// req.logIn will start the session
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				if(user.username == 'admin'){
				req.flash('success', 'You are now logged in as Admin');
				console.log(req.session);
				res.redirect('/admin');
			} else{
				req.flash('success', 'You are now logged in');
				console.log(req.session);
				res.location('/');
				res.redirect('/users/home')
			}
			});
		}
	})(req, res, next)
});

// FB Strategy
passport.use(new FacebookStrategy({
    clientID: 'FACEBOOK_APP_ID',
    clientSecret: 'FACEBOOK_APP_SECRET',
    callbackURL: "http://localhost:3000/login/auth/facebook/callback",
	profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
	console.log(profile);
    User.findOne({ providerId: profile.id }, function (err, user) {
		if (err) throw err;
		if(!user){
			var user = new User ({
				providerId: profile.id,
				provider: profile.provider,
				username: profile.displayName,
				usernameLowerCase: profile.displayName.toLowerCase(),
				email: profile.email,
				socialMediaProfilePhoto: profile.photos[0].value
			});
			user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
            });
		} else {
			return done(err, user);
		}
    });
  }
));

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback', function(req, res, next) {
	passport.authenticate('facebook', function(err, user, info){
		if (err) throw err;
		if(user.suspended){
			req.flash('error', 'Account suspended.');
			res.redirect('/login');
		}
		// req.logIn establishes a session
		req.logIn(user, function(err) {
			if (err) { return next(err); }

			req.flash('success','You are now logged in')
			res.redirect('/users/home')

		});
	})(req,res,next);
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    callbackURL: "http://localhost:3000/login/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
	console.log(profile);
	User.findOne({ providerId: profile.id }, function (err, user) {
		if (err) throw err;
		if(!user){
			var user = new User ({
				providerId: profile.id,
				provider: profile.provider,
				username: profile.displayName,
				usernameLowerCase: profile.displayName.toLowerCase(),
				email: profile.email,
				socialMediaProfilePhoto: profile.photos[0].value
			});
			user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
            });
		} else {
			return done(err, user);
		}
    });
  }
));

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', function(req, res, next) {
	passport.authenticate('google', function(err, user, info){
		if (err) throw err;
		if(user.suspended){
			req.flash('error', 'Account suspended.');
			res.redirect('/login');
		}
		// req.logIn establishes a session
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			req.flash('success','You are now logged in')
			res.redirect('/users/home')
		});
	})(req,res,next);
});



module.exports = router;
