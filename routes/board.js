const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Dashboard = require('../models/Dashboard');
const Column = require('../models/Column');
const Card = require('../models/Card');
const { dashboardSchema } = require('../validations/Board');
const Joi = require('joi');

const validate = schemas => (req, res, next) => {
    // const { body, params } = schemas
    for (const key of Object.keys(schemas)) {
        const schema = schemas[key];
        const { error } = schema.validate(req[key], { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details.map(detail => detail.message) });
        }
    }
    next();
};

router.post('/boards', auth, validate({ body: dashboardSchema })
    , async (req, res, next) => {

        const ownerId = req.user._id;
        const { name } = req.body;
        const optionals = Object.fromEntries(['icon', 'backgroundImage']
            .flatMap(k => req.body[k] ? [[k, req.body[k]]] : []));

        try {
            const newDashboard = new Dashboard({
                owner: ownerId,
                name, columns: [], ...optionals
            });

            await newDashboard.save();

            res.status(200).json(newDashboard);
        } catch (message) { next(message); }
    });

router.get('/boards', auth, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const dashboards = await Dashboard.find({ owner: userId });
        res.status(200).json({ dashboards });
    } catch (message) { next(message); }
});

const params = Joi.object({
    boardName: Joi.string().required().messages({
        'any.required': '{{#label}} is required'
    })
});
router.patch('/boards/:boardName', auth, validate({
    body: dashboardSchema.fork('name', (schema) => schema.optional()),
    params
}),
    async (req, res, next) => {
        const owner = req.user._id;
        const slug = req.params.boardName;
        // const optionals = Object.fromEntries(['icon', 'backgroundImage', 'name']
        //     .flatMap(k => req.body[k] ? [[k, req.body[k]]] : []));

        try {
            const dashboard = await Dashboard.findOne({ owner, slug });
            if (!dashboard) {
                return res.status(404).json({ message: 'Dashboard not found' });
            }
            Object.assign(dashboard, req.body);
            await dashboard.save();

            res.status(200).json(dashboard);
        } catch (message) { next(message); }
    });

router.delete('/boards/:boardName', auth, validate({ params }),
    async (req, res, next) => {
        const owner = req.user._id;
        const slug = req.params.boardName;

        try {
            const dashboard = await Dashboard.findOneAndDelete({ owner, slug });
            if (!dashboard) {
                return res.status(404).json({ message: 'Dashboard not found' });
            }
            await dashboard.populate('columns', 'cards');
            await Promise.all([
                Column.deleteMany({ _id: { $in: dashboard.columns } }),
                Card.deleteMany({ _id: { $in: dashboard.columns.flatMap(c => c.cards) } })
            ]);
            res.status(200).json({ message: 'Dashboard deleted successfully' });
        } catch (message) { next(message); }
    });

router.get('/boards/:boardName', auth, validate({ params }),
    async (req, res, next) => {
        const owner = req.user._id;
        const slug = req.params.boardName;

        try {
            const dashboard = await Dashboard.findOne({ owner, slug }).
                populate({ path: 'columns', populate: { path: 'cards' } });
            if (!dashboard) {
                return res.status(404).json({ message: 'Dashboard not found' });
            }
            res.status(200).json(dashboard);
        } catch (message) { next(message); }
    });

require('./cards')(router, validate);

module.exports = router;
