const Joi = require('@hapi/joi');

module.exports = Joi.object({
    isOffer:        Joi.bool().required(),
    quantity:       Joi.number().required(),
    details:        Joi.string().trim().allow(null).max(255),
    other:          Joi.string().trim().allow(null).max(255),
    type:           Joi.string().trim().max(255).required(),
});
