var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var customPagination = require('custom-pagination');


// Connect to database
var db = mongoose.createConnection('mongodb://localhost/samsblog');


var Post = require('../models/post');
var Category = require('../models/category');

router.get('/show/:id', function(req, res, next) {
	Post.findOne({_id: req.params.id}, function(err, post){
		if (err) throw err;
		res.render('show', {post: post});
	})
});

router.get('/category/:category', function(req, res, next) {

	Post.paginate({category:req.params.category}, customPagination.paginateOptions(req), function(err, posts) {
		customPagination.buildPagination(req, res, posts, 'category');
	});
});

router.get('/category/:category/:page', function(req, res, next) {

	Post.paginate({category:req.params.category}, customPagination.paginateOptions(req), function(err, posts) {
		customPagination.buildPagination(req, res, posts, 'category');
	});
});

module.exports = router;