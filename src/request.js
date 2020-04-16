'use strict';
const Response = require('../lib/response');
const BotDetection = require("../lib/botDetection");
const RequestFormSchema = require("./schema/request");
const AskFormSchema = require("./schema/ask");
const ValidateOrFail = require("../lib/validate");
const sendExceptionEmail = require("../lib/exception");
const sendSnsNotification = require("../lib/sns");

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
        let results, response;
        let isTesting = isTest(event);
        let request = JSON.parse(event.body);
        let requestForm = ValidateOrFail(request, RequestFormSchema);
        let isValidApiSecret = BotDetection.isValidApiSecret(requestForm.challenge);

        if (!isTesting && !isValidApiSecret) {
            await BotDetection.isHumanOrFail(requestForm.challenge)
        }

        results = await salesforceService.insertSObjectsFromForm(requestForm, isTesting);
        response = Response.createJsonResponse(
            isTesting? results : {},
            isTesting? 200 : 201,
        );
        console.log('request.send', 'results', results);

        if ('RA_AWS_SNS_NOTIFICATIONS_TOPIC' in process.env) {
            await sendSnsNotification('Request OK', {
                requestForm: requestForm,
                salesforce: results,
                response: response,
                isTesting: isTesting,
            });
        }
        
        callback(null, response);
    } catch (ex) {
        let details;
        if ("name" in ex && ex.name === "ValidationError") {
            if ("details" in ex && Array.isArray(ex.details) && ex.details.length > 0) {
                details = ex.details.map(detail => detail.message);
            }
        }

        console.log('request.send', 'error', ex);
        sendExceptionEmail(ex, event, context);

        callback(null, Response.createJsonErrorResponse(ex, 400, {}, details));
    }
};

module.exports.ask = async (event, context, callback) => {
    console.log('request.ask', 'event', event);

    try {
        let results, response;
        let isTesting = isTest(event);
        let request = JSON.parse(event.body);
        let askForm = ValidateOrFail(request, AskFormSchema);
        let isValidApiSecret = BotDetection.isValidApiSecret(askForm.challenge);

        if (!isTesting && !isValidApiSecret) {
            await BotDetection.isHumanOrFail(askForm.challenge)
        }

        results = await salesforceService.insertSObjectsFromAsk(askForm, isTesting);
        response = Response.createJsonResponse(
            isTesting? results : {},
            isTesting? 200 : 201,
        )
        console.log('request.ask', 'results', results);

        if ('RA_AWS_SNS_NOTIFICATIONS_TOPIC' in process.env) {
            await sendSnsNotification('Ask OK', {
                askForm: askForm,
                salesforce: results,
                response: response,
                isTesting: isTesting,
            });
        }

        callback(null, Response.createJsonResponse(
            isTesting? results : {},
            isTesting? 200 : 201,
        ));
    } catch (ex) {
        let details;
        if ("name" in ex && ex.name === "ValidationError") {
            if ("details" in ex && Array.isArray(ex.details) && ex.details.length > 0) {
                details = ex.details.map(detail => detail.message);
            }
        }

        console.log('request.ask', 'error', ex);
        sendExceptionEmail(ex, event, context);

        callback(null, Response.createJsonErrorResponse(ex, 400, {}, details));
    }
};

module.exports.hi = async (event, context, callback) => {
    if ('RA_AWS_SNS_NOTIFICATIONS_TOPIC' in process.env) {
        try {
            await sendSnsNotification('Got Hi');
        } catch (ex) {
            console.log('Hi', ex);
        }
    }

    callback(null, Response.createRedirectResponse(`https://${process.env.RA_DOMAIN}`));
};
