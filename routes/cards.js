const auth = require('../middlewares/auth');
const Dashboard = require('../models/Dashboard');
const Column = require('../models/Column');
const Card = require('../models/Card');

function moveElement(array, from, to) {
    if (from < 0) return;
    array.splice(to, 0, array.splice(from, 1)[0]);
}
const findBoard = async (req, res, next) => {
    const owner = req.user._id;
    const slug = req.params.boardName;
    try {
        const dashboard = await Dashboard.findOne({ owner, slug })
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }
        req.dashboard = dashboard
        next()
    } catch (error) {
        next(error)
    }
};

module.exports = router => {

    router.post('/boards/:boardName/column', auth, findBoard, async (req, res) => {
        const dashboard = req.dashboard;
        const { name } = req.body;
        try {
            const newColumn = new Column({
                name, cards: []
            });

            await newColumn.save();

            dashboard.columns.push(newColumn);
            // dashboard.markModified('columns');
            await dashboard.save();

            res.status(200).json(newColumn);
        } catch (message) {
            res.status(500).json({ message });
        }
    });

    router.patch('/boards/:boardName/column/:id', auth, findBoard, async (req, res) => {
        const dashboard = req.dashboard;
        const columnId = req.params.id;
        const { name, position } = req.body;
        try {
            if (name) {
                const column = await Column.findByIdAndUpdate(columnId, { name });
                res.status(200).json(column);
            }
            if (position) {
                const { columns } = dashboard;
                moveElement(columns, columns.indexOf(columnId), position);
                await dashboard.save();
                res.status(200).json(columns);
            }
        } catch (message) {
            res.status(500).json({ message });
        }
    });

    router.delete('/boards/:boardName/column/:id', auth, findBoard, async (req, res) => {
        const dashboard = req.dashboard;
        const columnId = req.params.id;

        try {
            const column = await Column.findByIdAndDelete(columnId);
            if (!column) {
                return res.status(404).json({ message: 'Column not found' });
            }
            dashboard.columns.splice(dashboard.columns.indexOf(columnId), 1);
            await dashboard.save();
            res.status(200).json({ message: 'Column deleted successfully' });
        } catch (message) {
            res.status(500).json({ message });
        }
    });


    router.post('/boards/:boardName/column/:id', auth, findBoard, async (req, res) => {
        const dashboard = req.dashboard;
        const columnId = req.params.id;
        const { title } = req.body;

        const optionals = Object.fromEntries(['priority', 'description', 'deadline']
            .flatMap(k => req.body[k] ? [[k, req.body[k]]] : []));

        try {
            const column = await Column.findById(columnId);
            if (!column || dashboard.columns.indexOf(columnId) < 0) {
                return res.status(404).json({ message: 'Column not found' });
            }
            const newCard = new Card({
                title,
                columnId,
                ...optionals
            });
            column.cards.push(newCard);
            await newCard.save();
            await column.save();
            res.status(200).json(newCard);
        } catch (message) {
            res.status(500).json({ message });
        }
    });

    router.patch('/boards/:boardName/:id', auth, findBoard, async (req, res) => {
        const dashboard = req.dashboard;
        const cardId = req.params.id;

        const optionals = Object.fromEntries(['columnId', 'title', 'priority', 'description', 'deadline']
            .flatMap(k => req.body[k] ? [[k, req.body[k]]] : []));

        try {
            const card = await Card.findById(cardId);
            if (!card) {
                return res.status(404).json({ message: 'Card not found' });
            }
            if (dashboard.columns.indexOf(card.columnId) < 0) {
                return res.status(404).json({ message: 'Column not found in this dashboard' });
            }
            const promises = [];
            if (optionals.columnId) {
                if (dashboard.columns.indexOf(optionals.columnId) < 0) {
                    return res.status(404).json({ message: 'New column not found in this dashboard' });
                }
                const [oldColumn, newColumn] = await Promise.all([card, optionals].map(k => Column.findById(k.columnId)));
                if (!newColumn || !oldColumn) {
                    return res.status(404).json({ message: 'Column not found' });
                }
                oldColumn.cards.splice(oldColumn.cards.indexOf(cardId), 1);
                newColumn.cards.push(cardId);
                promises.push(oldColumn.save(), newColumn.save());
            }
            Object.assign(card, optionals);
            promises.push(card.save());
            await Promise.all(promises)
            res.status(200).json(card);
        } catch (message) {
            res.status(500).json({ message });
        }
    });

    router.delete('/boards/:boardName/:id', auth, findBoard, async (req, res) => {
        const dashboard = req.dashboard;
        const cardId = req.params.id;

        try {
            const card = await Card.findById(cardId);
            if (!card) {
                return res.status(404).json({ message: 'Card not found' });
            }
            if (dashboard.columns.indexOf(card.columnId) < 0) {
                return res.status(404).json({ message: 'Column not found in this dashboard' });
            }
            const column = await Column.findById(card.columnId);
            const promises = [card.deleteOne()];
            if (column) {
                const cardIdx = column.cards.indexOf(cardId)
                if (cardIdx >= 0)
                    column.cards.splice(cardIdx, 1);
                promises.push(column.save());
            }
            await Promise.all(promises);
            res.status(200).json({ message: 'Card deleted successfully' });
        } catch (message) {
            res.status(500).json({ message });
        }
    });
}    
