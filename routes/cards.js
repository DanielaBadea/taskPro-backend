const auth = require('../middlewares/auth');
const Dashboard = require('../models/Dashboard');
const Column = require('../models/Column');
const Card = require('../models/Card');
const { columnSchema, cardSchema } = require('../validations/Board');
const Joi = require('joi');


/**
 * @swagger
 * components:
 *   schemas:
 *     Column:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "To Do"
 *         cards:
 *           type: array
 *           items: 
 *              type: string
 *              example: []
 * 
 *     Card:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Task Title"
 *         description:
 *           type: string
 *           example: "Task Description"
 *         priority:
 *           type: string
 *           enum: ['none', 'low', 'medium', 'high']
 *           example: "medium"
 *         deadline:
 *           type: string
 *           format: date
 *           example: "2024-12-01"
 *         columnId:
 *           type: string
 *           example: "6100ffee863a269063ba0660"
 */

/**
 * @swagger
 * /api/boards/{boardName}/column:
 *   post:
 *     summary: Add a new column to the board
 *     security: 
 *       - bearerAuth: []
 *     tags: [Columns]
 *     parameters:
 *       - in: path
 *         name: boardName
 *         required: true
 *         schema:
 *           type: string
 *         example: "my-dashboard"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "to do"
 *     responses:
 *       200:
 *         description: New column added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "to do"
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: []
 *                 _id:
 *                   type: string
 *                   example: "670117b5863a269063ba0673"
 *       404:
 *         description: Dashboard not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dashboard not found"
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 */

/**
 * @swagger
 * /api/boards/{boardName}/column/{id}:
 *   patch:
 *     summary: Update a column in the board
 *     security: 
 *       - bearerAuth: []
 *     tags: [Columns]
 *     parameters:
 *       - in: path
 *         name: boardName
 *         required: true
 *         schema:
 *           type: string
 *         example: "my-dashboard"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "670117b5863a269063ba0673"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "In progress"
 *     responses:
 *       200:
 *         description: Column updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "670117b5863a269063ba0673"
 *                 name:
 *                   type: string
 *                   example: "In progress"
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: []
 *       404:
 *         description: Column or board not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Column or board not found"
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 */

/**
 * @swagger
 * /api/boards/{boardName}/column/{id}:
 *   delete:
 *     summary: Delete a column
 *     security: 
 *       - bearerAuth: []
 *     tags: [Columns]
 *     parameters:
 *       - in: path
 *         name: boardName
 *         required: true
 *         schema:
 *           type: string
 *         example: "my-dashboard"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6100ffee863a269063ba0660"
 *     responses:
 *       200:
 *         description: Column deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Column deleted successfully."
 *       404:
 *         description: Column or board not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Column or board not found"
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 */

/**
 * @swagger
 * /api/boards/{boardName}/column/{id}/card:
 *   post:
 *     summary: Add a new card to a column
 *     security: 
 *       - bearerAuth: []
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: boardName
 *         required: true
 *         schema:
 *           type: string
 *         example: "my-dashboard"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "670117b5863a269063ba0673"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "project"
 *               description:
 *                 type: string
 *                 example: "make swagger doc"
 *               priority:
 *                 type: string
 *                 example: "medium"
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-10T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "project"
 *                 description:
 *                   type: string
 *                   example: "make swagger doc"
 *                 priority:
 *                   type: string
 *                   example: "medium"
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-06-10T00:00:00.000Z"
 *                 columnId:
 *                   type: string
 *                   example: "670117b5863a269063ba0673"
 *                 _id:
 *                   type: string
 *                   example: "67011ef8863a269063ba0689"
 *       404:
 *         description: Column or board not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Column or board not found"
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 */

/**
 * @swagger
 * /api/boards/{boardName}/card/{id}:
 *   patch:
 *     summary: Update card details in a board
 *     security: 
 *       - bearerAuth: []
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: boardName
 *         required: true
 *         schema:
 *           type: string
 *         example: "my-dashboard"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "67011ef8863a269063ba0689"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priority:
 *                 type: string
 *                 example: "high"
 *     responses:
 *       200:
 *         description: Card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67011ef8863a269063ba0689"
 *                 title:
 *                   type: string
 *                   example: "project"
 *                 description:
 *                   type: string
 *                   example: "make swagger doc"
 *                 priority:
 *                   type: string
 *                   example: "high"
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-06-10T00:00:00.000Z"
 *                 columnId:
 *                   type: string
 *                   example: "670117b5863a269063ba0673"
 *       404:
 *         description: Card or board not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card or board not found"
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 */

/**
 * @swagger
 * /api/boards/{boardName}/card/{id}:
 *   delete:
 *     summary: Delete a card
 *     security: 
 *       - bearerAuth: []
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: boardName
 *         required: true
 *         schema:
 *           type: string
 *         example: "my-dashboard"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6100ffee863a269063ba0660"
 *     responses:
 *       200:
 *         description: Card deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Card deleted successfully."
 *       404:
 *         description: Column or board not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Column or board not found"
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 */


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

module.exports = (router, validate) => {

    router.post('/boards/:boardName/column', auth, findBoard, validate({
        body: columnSchema
    }),
        async (req, res, next) => {
            const dashboard = req.dashboard;
            const { name } = req.body;
            try {
                const newColumn = new Column({
                    name, cards: []
                });

                await newColumn.save();

                dashboard.columns.push(newColumn);
                await dashboard.save();

                res.status(200).json(newColumn);
            } catch (message) { next(message); }
        });

    router.patch('/boards/:boardName/column/:id', auth, findBoard, validate({
        body: columnSchema.keys({ position: Joi.number().integer() })
    }), async (req, res, next) => {
        const dashboard = req.dashboard;
        const columnId = req.params.id;
        const { name, position } = req.body;
        try {
            let result = null;
            if (name) {
                const column = await Column.findByIdAndUpdate(columnId, { name });
                result = column;
            }
            if (position !== undefined) {
                const { columns } = dashboard;
                moveElement(columns, columns.indexOf(columnId), position);
                await dashboard.save();
                result = columns;
            }
            res.status(200).json(result);
        } catch (message) { next(message); }
    });

    router.delete('/boards/:boardName/column/:id', auth, findBoard, async (req, res, next) => {
        const dashboard = req.dashboard;
        const columnId = req.params.id;

        try {
            const column = await Column.findByIdAndDelete(columnId);
            if (!column) {
                return res.status(404).json({ message: 'Column not found' });
            }
            dashboard.columns.splice(dashboard.columns.indexOf(columnId), 1);
            await Promise.all([
                Card.deleteMany({ _id: { $in: column.cards } }),
                dashboard.save()
            ]);
            res.status(200).json({ message: 'Column deleted successfully' });
        } catch (message) { next(message); }
    });


    router.post('/boards/:boardName/column/:id', auth, findBoard, validate({
        body: cardSchema.fork(['columnId'], (schema) => schema.forbidden())
    }), async (req, res, next) => {
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
        } catch (message) { next(message); }
    });

    router.patch('/boards/:boardName/:id', auth, findBoard, validate({
        body: cardSchema.fork(['columnId', 'title'], (schema) => schema.optional())
    }), async (req, res, next) => {
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
        } catch (message) { next(message); }
    });

    router.delete('/boards/:boardName/:id', auth, findBoard, async (req, res, next) => {
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
        } catch (message) { next(message); }
    });
}    
