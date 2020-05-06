const Joi = require('@hapi/joi');
const stock = require('./stock');

module.exports = Joi.object({
    account:        Joi.string().trim().max(200),
    city:           Joi.string().trim().max(200).required(),
    name:           Joi.string().trim().max(255).required(),
    email:          Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    join:           Joi.bool().required(),
    phone:          Joi.string().trim().max(100).required(),
    postalCode:     Joi.string().trim().max(100).required(),
    street:         Joi.string().trim().max(255).required(),
    contactType:    Joi.string().trim().max(255).required(),
    challenge:      Joi.string().trim().required(),
    stocks:         Joi.array().items(stock).min(1).max(3).required(),
});
