var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({ dest: './public/images',
					  fileFilter: function (req, file, cb) {
						if (file.mimetype !== 'image/jpeg') {
						  var err;
						  return cb(
								err = {msg:'Wrong file type. Only JPG files may be used as avatars.'}
							)
						}

						cb(null, true)
					  },
					  limits: {
						fileSize: 51200,
						files: 1,		    
					  }
					}).single('avatar');


var mongo = require('mongodb');
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost/samsblog');

var User = require('../models/user');



router.get('/', function(req, res, next) {
	res.render('register');
});



router.post('/', function(req,res,next){
	// Get form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var usernameLowerCase = function(){if(username){username.toLowerCase()}};
	var password = req.body.password;
	var password2 = req.body.password2;

	
	
	upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
		console.log(err);
		var errors = [{msg : err[Object.keys(err)[0]]}];
		console.log(typeof (errors[Object.keys(errors)[0]]))
		res.render('register', {errors: errors})
    } else {

    // Everything went fine
	if(req.file){
		var avatar = req.file.filename;
	} else {
		var avatar = 'noavatar.jpg';
	}
	}

	var user = new User ({
		name: name,
		email: email,
		username: username,
		// usernameLowerCase needed because mongoose sort Z > a
		usernameLowerCase: function(){if(username){username.toLowerCase()}},
		password: password,
		avatar: avatar
	})

	req.checkBody('name', 'Name field must be filled').isLength({min:5, max: 24});
	req.checkBody('email', 'Email is not valid').isLength({min:5, max: 32});
	req.checkBody('username', 'Invalid Username').isLength({min:5, max: 12});
	req.checkBody('password', 'Invalid Password').isLength({min:6, max: 12});
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password2);
	
	var errors = req.validationErrors();
	
	if (errors){
		console.log(errors);
		res.render('register', {errors: errors})
	}  else {
			User.find({ usernameLowerCase: usernameLowerCase }, function(err, username){
				if (err) throw err;
				if (username.length) {
					req.flash('error', 'Username already exists. Please try another username.');
					res.redirect('/register')
				} else {
					User.find({email: email}, function(err, email){
						if(email.length){
							req.flash('error', 'Email is already registered. Please try again.');
							res.redirect('/register')
						} else{
							User.createUser(user, function(err){
								if (err) throw err;
								req.flash('success', 'You are now registered. Please log in below');
								res.redirect('/users/login')
							})
						}
					})
				}		
			});
		}
	})

});

module.exports = router;