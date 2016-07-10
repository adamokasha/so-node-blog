var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var customPagination = require('custom-pagination');

var db = mongoose.createConnection('mongodb://localhost/samsblog');

var User = require('../models/user');
var Post = require('../models/post');

// For all routes in /users check if user is authenticated
router.use('/*', function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect('/login');
} );

router.get('/home', function(req, res, next) {
	Post.paginate({}, customPagination.paginateOptions(req), function(err, posts) {
		if (err) throw err;
		customPagination.buildPagination(req, res, posts, 'userindex')
	});
});


router.get('/page/:page', function(req, res, next) {
	Post.paginate({}, customPagination.paginateOptions(req), function(err, posts) {		
		if (err) throw err;
		customPagination.buildPagination(req, res, posts, 'userindex')
	});
});

router.get('/show/:id', function(req, res, next) {
	Post.findOne({_id: req.params.id}, function(err, post){
		var username = req.user.username;
		if (err) throw err;
		res.render('usershow', {post: post, username: username});
	})
});

router.get('/category/:category', function(req, res, next) {

	Post.paginate({category:req.params.category}, customPagination.paginateOptions(req), function(err, posts) {
		customPagination.buildPagination(req, res, posts, 'usercategory');
	});
});

router.get('/category/:category/:page', function(req, res, next) {

	Post.paginate({category:req.params.category}, customPagination.paginateOptions(req), function(err, posts) {
		customPagination.buildPagination(req, res, posts, 'usercategory');
	});
});

router.post('/addcomment', function(req, res, next) {
	console.log(req.user);
	var postid = req.body.postid;
	var userId = req.user._id;
	var name= req.user.username;
	var body = req.body.body;
	var date = new Date();

	req.checkBody('body', 'Comment field blank').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		Post.findOne({_id: postid}, function(err, post){
		if (err) throw err;
		res.render('usershow', {errors: errors, post: post});
		})
	} else {
		// Important: Nodejs async so need to nest callbacks!
		User.findById(userId, function(err, user){
			Post.findByIdAndUpdate(postid, 
			{$push: {comments: {name: name, avatar: user.avatar, socialMediaProfilePhoto: user.socialMediaProfilePhoto , body: body, date: date}}}, 
			{safe: true, upsert: true},
			function(err, post){
				if (err) throw err;
				req.flash('success', 'Comment Added')
				res.location('/users/show/'+postid);
				res.redirect('/users/show/'+postid);
			});
		});
	}
});


router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You are now logged out');
	res.redirect('/login');
})


module.exports = router;