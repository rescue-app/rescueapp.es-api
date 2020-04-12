const Joi = require('@hapi/joi');

module.exports = Joi.object({
    quantity:       Joi.number().required(),
    details:        Joi.string().trim().allow(null).max(255),
    other:          Joi.string().trim().allow(null).max(255),
    type:           Joi.any().valid(...['offer', 'need']).required()
});
