const Joi = require('joi');

const ObjectId = Joi.string().hex().length(24).required().messages({
    'string.base': '{{#label}} should be a type of ObjectId',
    'string.hex': '{{#label}} should be a type of ObjectId',
    'string.length': '{{#label}} should be a type of ObjectId',
    'any.required': '{{#label}} is required'
});

module.exports = {
    cardSchema: Joi.object({
        title: Joi.string().required().messages({
            'string.base': '{{#label}} should be a type of text',
            'any.required': '{{#label}} is required'
        }),
        description: Joi.string().messages({
            'string.base': '{{#label}} should be a type of text'
        }),
        priority: Joi.string()
            .valid('none', 'low', 'medium', 'high')
            .default('none')
            .optional()
            .messages({
                'any.only': `{{#label}} must be one of the following: 'none', 'low', 'medium', 'high' `
            }),
        deadline: Joi.date().optional().messages({
            'any.only': `{{#label}} must be a valid date`,
        }),
        columnId: ObjectId
    }),

    columnSchema: Joi.object({
        name: Joi.string().required().messages({
            'string.base': '{{#label}} should be a type of text',
            'any.required': '{{#label}} is required'
        }),
        /* cards: Joi.array().items(ObjectId).messages({
            'array.base': '{{#label}} should be an array'
        }) */
    }),

    dashboardSchema: Joi.object({
        // owner: ObjectId,
        name: Joi.string().required().messages({
            'string.base': '{{#label}} should be a type of text',
            'any.required': '{{#label}} is required'
        }),
        // slug: Joi.string(),

        icon: Joi.string(),
        backgroundImage: Joi.string(),

        /* columns: Joi.array().items(ObjectId).messages({
            'array.base': '{{#label}} should be an array'
        }) */
    }),
}