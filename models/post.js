var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

// Connect to database
// Since we're using multiple connections must use createConnection
var db = mongoose.createConnection('mongodb://localhost/samsblog');

var Schema = mongoose.Schema;


var PostSchema = new Schema({
	title: String,
	category: String,
	author: String,
	body: String,
	date: { type: Date, default: Date.now },
	mainimage: String,
	comments: [{name: String, email: String, avatar: String, socialMediaProfilePhoto: String, body: String, date: Date}]
	},
	{collection: 'posts'}
)

PostSchema.plugin(mongoosePaginate);

// Here we convert our schema into a model. We give it a name('Post') and point at which schema(PostSchema)
var Post = module.exports = mongoose.model('Post', PostSchema);
