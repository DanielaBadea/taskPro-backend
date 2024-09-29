const { validateReg, validateLogin, validateBackground } = require('../validations/User');
const validate = require('../validations/NeedHelp');

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

const validateHelp = (req, res, next) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }
    next()
};

const validateBackgroundImage = (req, res, next) => {
    const { error } = validateBackground(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }
    next()
}
module.exports = { validateRegistration, validateLogIn, validateHelp , validateBackgroundImage};