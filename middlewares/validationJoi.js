const { validateReg, validateLogin } = require('../validations/User');

const validateRegistration = (req, res, next) => {
    const { error } = validateReg(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    next();
};

const validateLogIn = (req, res, next) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    next()
};

module.exports = { validateRegistration, validateLogIn };