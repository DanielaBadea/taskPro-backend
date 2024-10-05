const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const Help = require('../models/NeedHelp');
const { validateHelp } = require('../middlewares/validationJoi');
const auth = require('../middlewares/auth');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @swagger
 * components:
 *   schemas:
 *     Help:
 *       type: object
 *       properties:
 *         owner:
 *           type: string
 *           example: 66f793577cca6a8880257790
 *         comment:
 *           type: string
 *           minLength: 8
 *           maxLength: 800
 *           example: "I need help with my task."
 */

/**
 * @swagger
 * /api/need-help:
 *   post:
 *     summary: Submit a help request
 *     tags: [Help]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 800
 *                 example: "I need help with my task."
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email sent successfully!
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */



router.post('/need-help', auth, validateHelp, async (req, res) => {

    const ownerId = req.user._id;  
    const { comment } = req.body;  

    try {
        const newComment = new Help({
            owner: ownerId,
            comment,
        });

        await newComment.save();

        const populatedComment = await newComment.populate('owner', 'email');
        console.log(populatedComment);
        const userEmail = populatedComment.owner.email;

        const msg = {
            to: userEmail, 
            from: 'badeadaniella@gmail.com', 
            subject: 'Help - TaskPro',
            text: `You sent the following comment: "${comment}". We will contact you soon!`,
            html: `<p>You sent the following comment: <strong>${comment}</strong></p>
                   <p>We will contact you soon!</p>
                   <p>If you have any further questions, feel free to reach us at <strong>taskpro.project@gmail.com</strong></p>`
        };

        await sgMail.send(msg);

        res.status(200).json({ message: 'Email sent successfully!' });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error when sending the email:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
