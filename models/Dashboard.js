const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    columns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column'
    }],
}, {
    timestamps: true,
    versionKey: false
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

module.exports = Dashboard;