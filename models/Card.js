const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    priority: {
        type: String,
        enum: ['none', 'low', 'medium', 'high'],
        default: 'none'
    },
    deadline: {
        type: Date,
        required: false
    },
    columnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
        required: true,
        // index: true
    }
}, {
    versionKey: false
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
