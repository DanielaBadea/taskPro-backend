const mongoose = require('mongoose');
let Card = require('./Card');

const columnSchema = new mongoose.Schema({
    name: {
        type: String,
        // enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do',
        required: true
    },
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }],
},
    {
        versionKey: false
    });

columnSchema.pre('remove', async function (next) {
    await Card.deleteMany({ _id: { $in: this.cards } });
    next();
});

const Column = mongoose.model('Column', columnSchema);

module.exports = Column;