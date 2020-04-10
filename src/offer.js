'use strict';
const response = require('../lib/response');
const Salesforce = require("../lib/salesforce");

module.exports.get = (event, context, callback) => {
    const salesforce = new Salesforce(
        process.env.RA_SALESFORCE_USERNAME,
        process.env.RA_SALESFORCE_PASSWORD
    );

    if (!("reference" in event.pathParameters)) {
        callback(null, response.createPlainTextResponse('Reference not found in parameters', 404));
    }
    const reference = event.pathParameters.reference;

    salesforce.getOfferByReference(reference)
        .then(offer => {
            callback(null, response.createJsonResponse(offer));
        })
        .catch(err => {
            console.log('getOffer Error', err);
            callback(null, response.createPlainTextResponse(`Offer with reference '${reference}' does not exist`, 404));
        });
};
