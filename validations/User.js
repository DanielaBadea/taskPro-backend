const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.min': `{{#label}} should have a minimum length of {#limit}`,
        'string.max': `{{#label}} should have a maximum length of {#limit}`,
        'any.required': `{{#label}} is required`
    }),
    email: Joi.string().email().required().messages({
        'string.email': `{{#label}} must be followed by a '.' domain suffix. For example, adrian@gmail.com`,
        'any.required': `{{#label}} is required`,
    }),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).min(6).max(60).required().messages({
        'string.min': `{{#label}} should have a minimum length of {#limit}`,
        'string.max': `{{#label}} should have a maximum length of {#limit}`,
        'any.required': `{{#label}} is required`
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': `{{#label}} must be followed by a '.' domain suffix. For example, adrian@gmail.com`,
        'any.required': `{{#label}} is required`,
    }),
    password: Joi.string().min(6).max(60).required().messages({
        'string.min': `{{#label}} should have a minimum length of {#limit}`,
        'string.max': `{{#label}} should have a maximum length of {#limit}`,
        'any.required': `{{#label}} is required`
    }),
    theme: Joi.string().valid('light', 'dark', 'violet').default('dark').optional().messages({
        'any.only': `{{#label}} must be one of the following: 'light', 'dark', 'violet' `,
        'any.optional': `{{#label}} is optional`
    })
});

const backgroundSchema = Joi.object({
    // allow(null) - Permitem ca valoarea sa fie si null - permite campului sa fie gol sau sa nu aiba o imagine de fundal setata
    backgroundImage: Joi.string().allow(null).optional().messages({
        'string.base': '{{#label}} trebuie să fie un șir de caractere',
        'any.allowOnly': '{{#label}} poate fi null sau un string valid',
        'any.optional': '{{#label}} este opțional'
    })
});

const validateReg = (user) => {
    return registerSchema.validate(user, { abortEarly: false }); 
};

const validateLogin = (user) => {
    return loginSchema.validate(user, { abortEarly: false }); 
};

const validateBackground = (image) => {
    return backgroundSchema.validate(image, { abortEarly: false })
};

module.exports = { validateReg, validateLogin, validateBackground };
