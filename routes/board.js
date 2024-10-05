const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Dashboard = require('../models/Dashboard');
const Column = require('../models/Column');
const Card = require('../models/Card');
const { dashboardSchema } = require('../validations/Board');
const Joi = require('joi');

/**
 * @swagger
 * components:
 *   schemas:
 *     Dashboard:
 *       type: object
 *       properties:
 *         owner:
 *           type: string
 *           example: "60c72b2f4f1a2c001e6a5678"
 *         name:
 *           type: string
 *           example: "My Dashboard"
 *         slug:
 *           type: string
 *           example: "my-dashboard"
 *         icon:
 *           type: string
 *           example: "icon_url"
 *         backgroundImage:
 *           type: string
 *           example: "background_image_url"
 *         columns:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - owner
 *         - name
 *       example:
 *         owner: "60c72b2f4f1a2c001e6a5678"
 *         name: "My Dashboard"
 *         icon: "icon_url"
 *         backgroundImage: "background_image_url"
 *         columns: []
 */

/**
 * @swagger
 * /api/boards:
 *   post:
 *     summary: Create a new board
 *     security: 
 *        - bearerAuth : []
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Dashboard
 *     responses:
 *       200:
 *         description: Board created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f4f1a2c001e6a1234"
 *                     owner:
 *                       type: string
 *                       example: "60c72b2f4f1a2c001e6a5678"
 *                     name:
 *                       type: string
 *                       example: "My Dashboard"
 *                     columns:
 *                       type: array
 *                       example: []
 *                     slug:
 *                       type: string
 *                       example: "my-dashboard"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request validation failed"
 *       401:
 *         description: Unauthorized
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
 * /api/boards:
 *   get:
 *     summary: Get all boards
 *     security: 
 *        - bearerAuth : []
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: List of boards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dashboards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60c72b2f4f1a2c001e6a1234"
 *                       owner:
 *                         type: string
 *                         example: "60c72b2f4f1a2c001e6a5678"
 *                       name:
 *                         type: string
 *                         example: "My Dashboard"
 *                       columns:
 *                         type: array
 *                         example: []
 *                       slug:
 *                         type: string
 *                         example: "my-dashboard"
 *       401:
 *         description: Unauthorized
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
 * /api/boards/{boardName}:
 *   patch:
 *     summary: Update an existing board
 *     security: 
 *        - bearerAuth : []
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: boardName
 *         required: true
 *         description: Name of the board
 *         schema:
 *           type: string
 *           example: My Dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Dashboard Name
 *               icon:
 *                 type: string
 *                 example: new_icon_url
 *               backgroundImage:
 *                 type: string
 *                 example: new_background_image_url
 *     responses:
 *       200:
 *         description: Board updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f4f1a2c001e6a1234"
 *                     owner:
 *                       type: string
 *                       example: "60c72b2f4f1a2c001e6a5678"
 *                     name:
 *                       type: string
 *                       example: "New Dashboard Name"
 *                     columns:
 *                       type: array
 *                       example: []
 *                     icon:
 *                       type: string
 *                       example: "new_icon_url"
 *                     backgroundImage:
 *                       type: string
 *                       example: "new_background_image_url"
 *       404:
 *         description: Board not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Board not found"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request validation failed"
 *       401:
 *         description: Unauthorized
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
 * /api/boards/{boardName}:
 *   delete:
 *     summary: Delete an existing dashboard
 *     security: 
 *        - bearerAuth : []
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: boardName
 *         required: true
 *         description: Name of the board
 *         schema:
 *           type: string
 *           example: My Dashboard
 *     responses:
 *       200:
 *         description: Dashboard deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dashboard deleted successfully"
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
 *         description: Unauthorized
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
 * /api/boards/{boardName}:
 *   get:
 *     summary: Get a specific board
 *     security: 
 *        - bearerAuth : []
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: boardName
 *         required: true
 *         description: Name of the board
 *         schema:
 *           type: string
 *           example: My Dashboard
 *     responses:
 *       200:
 *         description: Details of the board
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f4f1a2c001e6a1234"
 *                     owner:
 *                       type: string
 *                       example: "60c72b2f4f1a2c001e6a5678"
 *                     name:
 *                       type: string
 *                       example: "My Dashboard"
 *                     columns:
 *                       type: array
 *                       example: []
 *                     slug:
 *                       type: string
 *                       example: "my-dashboard"
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
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 */


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
