const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/help', async (req, res) => {
    const { email, comment } = req.body;

    if (!email || !comment) {
        return res.status(400).json({ message: 'Email and comment are required!' });
    }

    const msg = {
        to: email, 
        from: 'badeadaniella@gmail.com', 
        subject: 'Help - TaskPro',
        text: `You sent the following comment: "${comment}". We will contact you soon!`,
        html: `<p>You sent the following comment: <strong>${comment}</strong></p>
               <p>We will contact you soon!</p>
               <p>If you have any further questions, feel free to reach us at <strong>taskpro.project@gmail.com</strong></p>`
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ message: 'Email send successfully!' });
    } catch (error) {
        console.error('Error when sending the email:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
