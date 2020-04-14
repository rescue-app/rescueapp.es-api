'use strict';
const Response = require('../lib/response');
const Recaptcha = require("../lib/recaptcha");
const RequestFormSchema = require("./schema/request");
const AskFormSchema = require("./schema/ask");
const ValidateOrFail = require("../lib/validate");
const sendExceptionEmail = require("../lib/exception");

const Salesforce = require('../lib/salesforce');
const salesforceService = new Salesforce(
    process.env.RA_SALESFORCE_USERNAME,
    process.env.RA_SALESFORCE_PASSWORD
);

function isTest(event) {
    if (
        null !== event.queryStringParameters
        && 'queryStringParameters' in event
        && 'test' in event.queryStringParameters
        && '1' === event.queryStringParameters.test
    ) {
        return true;
    }

    return false;
}

module.exports.send = async (event, context, callback) => {
    console.log('request.send', 'event', event);

    try {
        let results;
        let isTesting = isTest(event);
        let request = JSON.parse(event.body);
        let requestForm = ValidateOrFail(request, RequestFormSchema);

        if (!isTesting) {
            await Recaptcha.isHumanOrFail(requestForm.challenge)
        }

        results = await salesforceService.insertSObjectsFromForm(requestForm, isTesting);
        console.log('request.send', 'results', results);
        
        callback(null, Response.createJsonResponse(
            isTesting? results : {},
            isTesting? 200 : 201,
        ));
    } catch (ex) {
        console.log('request.send', 'error', ex);
        sendExceptionEmail(ex, event, context);

        callback(null, Response.createJsonErrorResponse(ex, 400));
    }
};

module.exports.ask = async (event, context, callback) => {
    console.log('request.ask', 'event', event);

    try {
        let results;
        let isTesting = isTest(event);
        let request = JSON.parse(event.body);
        let askForm = ValidateOrFail(request, AskFormSchema);

        if (!isTesting) {
            await Recaptcha.isHumanOrFail(askForm.challenge)
        }

        results = await salesforceService.insertSObjectsFromAsk(askForm, isTesting);
        console.log('request.ask', 'results', results);
        
        callback(null, Response.createJsonResponse(
            isTesting? results : {},
            isTesting? 200 : 201,
        ));
    } catch (ex) {
        console.log('request.ask', 'error', ex);
        sendExceptionEmail(ex, event, context);

        callback(null, Response.createJsonErrorResponse(ex, 400));
    }
};

module.exports.hi = async (event, context, callback) => {
    callback(null, Response.createRedirectResponse(`https://${process.env.RA_DOMAIN}`));
};
