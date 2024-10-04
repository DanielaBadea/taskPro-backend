const mongoose = require('mongoose');
const { sluggerPlugin } = require('mongoose-slugger-plugin');
let Column = require('./Column')

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
    slug: String,

    icon: String,
    backgroundImage: String,

    columns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column'
    }],
}, {
    timestamps: true,
    versionKey: false
});

/* dashboardSchema.pre('deleteOne', async function (next) {
    await Column.deleteMany({ _id: { $in: this.columns } });
    next();
}); */

dashboardSchema.index({ owner: 1, slug: 1 }, { name: 'owner_slug', unique: true });

dashboardSchema.plugin(sluggerPlugin, {
    // the property path which stores the slug value
    slugPath: 'slug',
    // specify the properties which will be used for generating the slug
    generateFrom: ['name'],
    // specify the max length for the slug
    maxLength: 15,
    // the unique index, see above
    index: 'owner_slug',
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

module.exports = Dashboard;