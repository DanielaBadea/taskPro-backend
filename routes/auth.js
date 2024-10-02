const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const auth = require('../middlewares/auth');
const { validateRegistration, validateLogIn, validateBackgroundImage} = require('../middlewares/validationJoi');
require('dotenv').config();
const gravatar = require('gravatar');
const upload = require('../services/cloudinary');


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Popescu Andrei
 *         email:
 *           type: string
 *           example: popescu.andrei@example.com
 *         password:
 *           type: string
 *           example: securepassword
 *         avatarURL:
 *           type: string
 *           example: http://example.com/avatar.jpg
 *         theme:
 *           type: string
 *           enum: [light, dark, violet]
 *           default: dark
 *         backgroundImage:
 *           type: string
 *           example: bg_tablet15@1x.png
 *     Token:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successful registration!
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: popescu.andrei@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome Popescu Andrei
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description : Not authorized
 *       409:
 *         description: Email or password is wrong
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Get current user info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description : Not authorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/update:
 *   patch:
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Popescu David
 *               email:
 *                 type: string
 *                 example: popescu.david@example.com
 *               password:
 *                 type: string
 *                 example: newsecurepassword
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: User data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully data updated!
 *                 update:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *          description : Not authorized
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/change-theme:
 *   patch:
 *     summary: Change user theme
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [light, dark, violet]
 *     responses:
 *       200:
 *         description: Theme updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Theme updated successfully
 *                 owner:
 *                   type: string
 *                   example: 66f793577cca6a8880257790
 *                 theme:
 *                   type: string
 *                   example: violet
 *       401:
 *          description : Not authorized
 *       400:
 *         description: Invalid theme
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/logout:
 *   get:
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully logged out!
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /users/{userId}/set-background:
 *   patch:
 *     summary: Set a background image for the user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *       - in: body
 *         name: User
 *         description: User object with the background image field
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully set up background image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Succesfully setup background image!
 *                 backgroundImage:
 *                   type: string
 *                   example: /images/bg_desktop1@1x.png
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

// REGISTER

router.post('/register', validateRegistration, async (req, res, next) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered!" });
        }

        const avatarURL = gravatar.url(email, { s: '250', r: 'pg', d: 'monsterid' }, true);
        const newUser = new User({
            name: name,
            email: email,
            password: password,
            avatarURL: avatarURL,
        });

        await newUser.save();

        return res.status(201).json({
            message: 'Succesful registration!',
            user: {
                name: newUser.name,
                email: newUser.email,
                avatarURL: newUser.avatarURL,
            }
        });
        
    } catch (error) {
         console.error("Error during register:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// LOGIN 

router.post('/login', validateLogIn, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found with email:", email);
            return res.status(401).json({ message: 'Email or password is wrong' });
        }

        const isPasswordValid = await user.isValidPassword(password);

        if (!isPasswordValid) {
            console.error("Invalid password for user:", password);
            return res.status(401).json({ message: 'Email or password is wrong' });
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '3h' });
        user.token = token;

        await user.save();

        res.status(200).json({
            message: `Welcome ${user.name}`,
            user: {
                name: user.name,
                email: user.email,
                avatarURL: user.avatarURL
            },
            token
        });
        
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// CURRENT USER

router.get('/current', auth, async (req, res, next) => {
    try {
        const { name, avatarURL, theme} = req.user;

        res.json({
            user: {
                name,
                avatarURL,
                theme,
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// UPDATE USER

router.patch('/update', auth, upload.single('avatar'), async (req, res, next) => {
    try {

        const { name, email, password } = req.body;
        const user = req.user;
        const file = req.file;

        if (file) {
            user.avatarURL = file.path;
        };

        if (name) {
            user.name = name;
        }

        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser)
                return res.status(401).json({ message: 'Email already registered!' });
            user.email = email;
        }

        if (password) {
            await password.setPassword(password);
        }

        await user.save();

        res.status(200).json({
            message: "Successfully data updated!",
            update: {
                name: user.name,
                email: user.email,
                avatarURL: user.avatarURL
            }
        });
        
    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// CHANGE THEME

router.patch('/change-theme', auth, async (req, res, next) => {
    try {
        const { theme } = req.body; 
        const userId = req.user._id;
        
        const availableThemes = ['light', 'dark', 'violet'];

        const themeIndex = availableThemes.findIndex(t => t === theme);

        if (themeIndex === -1) {
            return res.status(400).json({ message: 'Invalid theme' });
        }

        // if (!availableThemes.includes(theme)) {
        //     return res.status(400).json({ message: 'Invalid theme' });
        // }

        const user = req.user;
        user.theme = availableThemes[themeIndex];

        await user.save();

        res.status(200).json({
            message: 'Theme updated successfully',
            owner: userId,
            theme: user.theme
        });

    } catch (error) {
        console.error("Error updating theme:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// LOGOUT

router.get('/logout', auth, async (req, res, next) => {
    try {
        const user = req.user;

        user.token = null;
        await user.save();

        res.status(200).json({message: 'Successfully logged out!'})

    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// SET BACKROUND
router.patch('/users/:userId/set-background',auth, validateBackgroundImage, async (req, res) => {
    try {
        const { userId } = req.params;
        const { backgroundImage } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: `The user with id ${userId} not found!` });
        }

        const imageUrl = `/images/${backgroundImage}`;
        user.backgroundImage = imageUrl; 
        await user.save();

        res.status(200).json({
            message: 'Succesfully setup background image!',
            backgroundImage: imageUrl
        });
    } catch (error) {
        res.status(500).json({ message: 'Eroare server', error });
    }
});

module.exports = router;