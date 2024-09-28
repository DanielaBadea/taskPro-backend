const Joi = require("joi");

const ObjectId = Joi.string().length(24).hex().message('Invalid ObjectId format');

const helpShema = Joi.object({
    owner: ObjectId,
    comment: Joi.string().min(8).max(800).required().messages({
        'string.base': '{{#label}} should be a type of text',
        'string.min': '{{#label}} should have a minimum length of {#limit}',
        'string.max': '{{#label}} should have a maximum length of {#limit}',
        'any.required': '{{#label}} is required'
    })
});

const validate = (help) => {
    return helpShema.validate(help, { abortEarly: false })
};

module.exports = validate;