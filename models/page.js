var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Page = new Schema({
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    summary: { type: String, trim: true },
    content: { type: String, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    categories: [{ type: String, trim: true, lowercase: true }],
    keywords: [{ type: String, trim: true, lowercase: true }],
    slug: { type: String, trim: true, lowercase: true },
    name: { type: String, trim: true },
    url: { type: String, trim: true, lowercase: true },
    language: { type: String, default: 'en' },
    translations: [{
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        summary: { type: String, trim: true },
        content: { type: String, trim: true },
        tags: [{ type: String, trim: true, lowercase: true }],
        categories: [{ type: String, trim: true, lowercase: true }],
        keywords: [{ type: String, trim: true, lowercase: true }],
        slug: { type: String, trim: true, lowercase: true },
        name: { type: String, trim: true },
        url: { type: String, trim: true, lowercase: true },
        language: { type: String, default: 'de' }
    }],
    images: [{ type: String, trim: true, lowercase: true }],
    attachments: [{ type: String, trim: true, lowercase: true }],
    thumbnail: { type: String, trim: true, lowercase: true },
    author: { type: mongoose.Schema.Types.ObjectId },
    status: { type: String, trim: true, lowercase: true, default: 'draft' },
    date: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    nav: { type: Boolean, default: false },
    footer: { type: Boolean, default: false },
    template: { type: String, trim: true, lowercase: true, default: 'main' },
    parent: { type: String, trim: true, lowercase: true, default: 'main' }
});


module.exports = mongoose.model('Page', Page);

