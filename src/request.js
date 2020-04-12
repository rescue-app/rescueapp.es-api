'use strict';
const Response = require('../lib/response');
const Validation = require("../lib/validation");

module.exports.send = (event, context, callback) => {
    try {
        let request = JSON.parse(event.body);
        let result = Validation.getValidFormFromRequest(request);
        
        callback(null, Response.createJsonResponse(result));
    } catch (ex) {
        callback(null, Response.createPlainTextResponse(ex, 400));
    }
    
    return;
};
