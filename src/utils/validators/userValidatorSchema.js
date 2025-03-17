const Joi = require("joi");

const userSchema = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2
      }),
    password: Joi.string()
        .min(5)
        .max(30)
        .required()
        .messages({
        "string.empty": `Password cannot be empty`,
        'string.min': `Password should have a minimum length of {#limit}`,
        'string.max': `Password should have a maximum length of {#limit}`,
        "any.required": `Password is required`,
    }),
    location: Joi.string()
        .required()
        .messages({
            'any.required': 'Location is required',
            'string.empty': 'Location cannot be empty'
        }),
});      

module.exports = userSchema;