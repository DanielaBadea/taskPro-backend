const mongoose = require('mongoose');

export const cardSchema = new mongoose.Schema({
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
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    deadline: {
        type: Date,
        required: false
    },
    columnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
        required: true
    }
}, {
    versionKey: false
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
