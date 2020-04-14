'use strict';
const Response = require('../lib/response');
const Salesforce = require("../lib/salesforce");
const SalesforceFields = require("../lib/salesforceFields");
const sendExceptionEmail = require("../lib/exception");

module.exports.get = async (event, context, callback) => {
    const salesforceService = new Salesforce(
        process.env.RA_SALESFORCE_USERNAME,
        process.env.RA_SALESFORCE_PASSWORD
    );

    if(!("pathParameters" in event) || !(event.pathParameters instanceof Object)) {
        return callback(null, Response.createPlainTextResponse('Missing parameters in request', 404));
    }

    if (!("reference" in event.pathParameters)) {
        return callback(null, Response.createPlainTextResponse('Reference not found in parameters', 404));
    }

    if (!("id" in event.pathParameters)) {
        return callback(null, Response.createPlainTextResponse('Id not found in parameters', 404));
    }

    const reference = event.pathParameters.reference;
    const id = event.pathParameters.id;

    try {
        let offer = await salesforceService.getObject(reference);

        if (offer[SalesforceFields.FIELD_ID].toLowerCase() !== id.toLowerCase()) {
            return callback(null, Response.createPlainTextResponse(`Invalid id for offer with reference '${reference}'`, 404));
        }

        let returnedOffer = {
            'id':           offer[SalesforceFields.FIELD_ID].toLowerCase(),
            'reference':    offer[SalesforceFields.FIELD_REFERENCE],
            'createdAt':    offer[SalesforceFields.FIELD_SALESFORCE_CREATED_DATE],
            'quantity':     offer[SalesforceFields.FIELD_QUANTITY],
            'type':         offer[SalesforceFields.FIELD_TYPE],
            'details':      offer[SalesforceFields.FIELD_DETAILS],
            'other':        offer[SalesforceFields.FIELD_OTHER],
        }

        return callback(null, Response.createJsonResponse(returnedOffer));
    } catch (ex) {
        console.log('getOffer Error', ex);
        sendExceptionEmail(ex, event, context);
        
        return callback(null, Response.createPlainTextResponse(`Offer with reference '${reference}' does not exist`, 404));
    }
};
