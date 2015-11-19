var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Page = new Schema({
    description: { type: String, trim:true },
    title: { type: String, trim:true },
    summary: { type: String, trim:true },
    tags: [String],
    publishedDate: { type: Date },
    slug: { type: String, trim:true  },
    language: {type: String, default: 'en'},
    translation: {
        description: { type: String, trim:true },
        title: { type: String, trim:true },
        summary: { type: String, trim:true },
        tags: [String],
        slug: { type: String, trim:true  },
        language: { type: String, default: 'de' }
    },
    author: { type: mongoose.Schema.Types.ObjectId },
    state: { type: String, trim:true, lowercase:true, default: 'new' },
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Page', Page);

