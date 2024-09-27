const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    comment: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 800, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
});

const Help = mongoose.model('Help', helpSchema);

module.exports = Help;
