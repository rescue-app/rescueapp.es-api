const Joi = require('@hapi/joi');

module.exports = Joi.object({
    to:             Joi.array().items(Joi.string()),
    fromName:       Joi.string().trim().required(),
    fromEmail:      Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    subject:        Joi.string().trim().required(),
    htmlBody:       Joi.string().trim().required(),
    plainBody:      Joi.string().trim().required(),
});
