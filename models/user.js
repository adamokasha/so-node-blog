var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');

// Connect to database
// Since we're using multiple connections must use createConnection!
var db = mongoose.createConnection('mongodb://localhost/samsblog');


var UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String
	},
	username: {
		type: String,
		index: true,
	},
	usernameLowerCase: {
		type: String,
	},
	password: {
		type: String,
	},
	avatar: {
		type: String
	},
	providerId : {
		type: String
	},
	provider : {
		type: String, default: 'local'
	},
	socialMediaProfilePhoto: {
		type: String
	},
	suspended: {
		type: Boolean, default: false
	},
})


UserSchema.plugin(mongoosePaginate);

// Here we convert our schema into a model. We give it a name('User') and point at which schema(UserSchema)
var User = module.exports = mongoose.model('User', UserSchema);

// Used for local authentication with passportjs
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// Used for local authentication with passportjs
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

// bcrypt compare returns true or false as the response
module.exports.comparePassword = function(candidatePassword, hash, callback){
	// Use bcrypt compare
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		callback(null, isMatch);
	});
} 

// Creates a new user
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
			// newUser is what we want to hash
			bcrypt.hash(newUser.password, salt, function(err, hash) {
				// Hashing the password
				newUser.password = hash;
				// Saving the hashed password (.save is mongoose function)
				newUser.save(callback); 
			});
		});
}