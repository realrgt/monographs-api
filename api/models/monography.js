const mongoose = require('mongoose');

const monographySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: { type: String, required: true },
    course: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: 'There is not an available description for the given data!' },
    course: { type: String, required: true },
    docFile: { type: String, required: true },
    imgFile: { type: String, required: true },
    rating: { type: Number, default: 1 }
});

module.exports = mongoose.model('Monography', monographySchema);
