'use strict';
const Response = require('../lib/response');
const Validation = require("../lib/validation");
const Recaptcha = require("../lib/recaptcha");

module.exports.send = async (event, context, callback) => {
    try {
        let request = JSON.parse(event.body);
        let result = Validation.getValidFormFromRequest(request);
        let isHuman = await Recaptcha.isHuman(result.challenge)
        
        callback(null, Response.createJsonResponse(result));
    } catch (ex) {
        callback(null, Response.createJsonErrorResponse(ex, 400));
    }
    
    return;
};
