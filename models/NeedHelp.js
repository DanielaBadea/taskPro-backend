const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
    owner: {
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
    
},
    {
        versionKey: false,
        timestamps: true
    });

const Help = mongoose.model('Help', helpSchema);

module.exports = Help;
