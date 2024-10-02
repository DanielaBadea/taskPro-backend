const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Dashboard = require('../models/Dashboard');

router.post('/boards', auth, async (req, res) => {

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
    } catch (message) {
        res.status(500).json({ message });
    }
});

router.get('/boards', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const dashboards = await Dashboard.find({ owner: userId });
        res.status(200).json({ dashboards });
    } catch (message) {
        res.status(500).json({ message });
    }
});

router.patch('/boards/:boardName', auth, async (req, res) => {
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
    } catch (message) {
        res.status(500).json({ message });
    }
});

router.delete('/boards/:boardName', auth, async (req, res) => {
    const owner = req.user._id;
    const slug = req.params.boardName;

    try {
        const dashboard = await Dashboard.findOneAndDelete({ owner, slug });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }
        res.status(200).json({ message: 'Dashboard deleted successfully' });
    } catch (message) {
        res.status(500).json({ message });
    }
});

router.get('/boards/:boardName', auth, async (req, res) => {
    const owner = req.user._id;
    const slug = req.params.boardName;

    try {
        const dashboard = await Dashboard.findOne({ owner, slug }).
            populate({ path: 'columns', populate: { path: 'cards' } });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }
        res.status(200).json(dashboard);
    } catch (message) {
        res.status(500).json({ message });
    }
});

require('./cards')(router);

module.exports = router;
