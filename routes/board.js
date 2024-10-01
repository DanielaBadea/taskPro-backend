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

        res.status(200).json({ message: 'new Dashboard created' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/boards', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const dashboards = await Dashboard.find({ owner: userId });
        res.status(200).json({ dashboards });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
