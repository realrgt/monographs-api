const mongoose = require('mongoose');

const testerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: { type: String, required: true },
    // docFile: { type: String, required: false },
    // image: { type: String, required: true },
    rating: { type: Number, default: 1 }
});

module.exports = mongoose.model('Tester', testerSchema);