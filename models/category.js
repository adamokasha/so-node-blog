var mongoose = require('mongoose');

// Connect to database
// Since we're using multiple connections must use createConnection
var db = mongoose.createConnection('mongodb://localhost/samsblog');

var Schema = mongoose.Schema;


var CategorySchema = new Schema({
	name: String,
	},
	{collection: 'categories'}
)

// Here we convert our schema into a model. We give it a name('Post') and point at which schema(PostSchema)
var Category = module.exports = mongoose.model('Category', CategorySchema);
