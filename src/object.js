'use strict';
const Response = require('../lib/response');
const Salesforce = require("../lib/salesforce");
const SalesforceFields = require("../lib/salesforceFields");
const sendExceptionEmail = require("../lib/exception");

module.exports.get = async (event, context, callback, isOffer) => {
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

    if (isOffer && !SalesforceFields.OFFER_REGEX.test(reference)) {
        return callback(null, Response.createPlainTextResponse('Invalid reference format for offer', 404));
    } else if (!isOffer && !SalesforceFields.NEED_REGEX.test(reference)) {
        return callback(null, Response.createPlainTextResponse('Invalid reference format for need', 404));
    }

    try {
        let object = await salesforceService.getObject(reference);

        if (object[SalesforceFields.FIELD_ID].toLowerCase() !== id.toLowerCase()) {
            return callback(null, Response.createPlainTextResponse(`Invalid id for reference '${reference}'`, 404));
        }

        let returnedObject = {
            'id':           object[SalesforceFields.FIELD_ID].toLowerCase(),
            'reference':    object[SalesforceFields.FIELD_REFERENCE],
            'createdAt':    object[SalesforceFields.FIELD_SALESFORCE_CREATED_DATE],
            'quantity':     object[SalesforceFields.FIELD_QUANTITY],
            'type':         object[SalesforceFields.FIELD_TYPE],
            'details':      object[SalesforceFields.FIELD_DETAILS],
            'other':        object[SalesforceFields.FIELD_OTHER],
            'isOffer':      isOffer,
        }

        return callback(null, Response.createJsonResponse(returnedObject));
    } catch (ex) {
        console.log('getObject Error', ex);
        sendExceptionEmail(ex, event, context);
        
        return callback(null, Response.createPlainTextResponse(`Reference '${reference}' does not exist`, 404));
    }
};
