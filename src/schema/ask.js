const Joi = require('@hapi/joi');

module.exports = Joi.object({
    account:        Joi.string().trim().max(200).required(),
    city:           Joi.string().trim().max(200).required(),
    name:           Joi.string().trim().max(255).required(),
    email:          Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    join:           Joi.bool().required(),
    phone:          Joi.string().trim().max(100).required(),
    postalCode:     Joi.string().trim().max(100).required(),
    street:         Joi.string().trim().max(255).required(),
    contactType:    Joi.string().trim().max(255).required(),
    challenge:      Joi.string().trim().required(),
    details:        Joi.string().trim().max(230),
    reference:      Joi.string().trim().min(7).max(8).required(),
});
