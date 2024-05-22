const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    title: String,
    youtubeIframe: String,
    text: String,
    pdfUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Lighting', 'Unreal', 'Virtual', 'Teleprompter', 'Greenscreen'],
        required: true
    },
    tutorials: [tutorialSchema]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
