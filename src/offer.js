'use strict';
const Response = require('../lib/response');
const Salesforce = require("../lib/salesforce");

module.exports.get = (event, context, callback) => {
    const salesforce = new Salesforce(
        process.env.RA_SALESFORCE_USERNAME,
        process.env.RA_SALESFORCE_PASSWORD
    );

    if (!("reference" in event.pathParameters)) {
        callback(null, Response.createPlainTextResponse('Reference not found in parameters', 404));
    }
    const reference = event.pathParameters.reference;

    salesforce.getOfferByReference(reference)
        .then(offer => {
            callback(null, Response.createJsonResponse(offer));
        })
        .catch(err => {
            console.log('getOffer Error', err);
            callback(null, Response.createPlainTextResponse(`Offer with reference '${reference}' does not exist`, 404));
        });
};
