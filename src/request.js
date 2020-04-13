'use strict';
const Response = require('../lib/response');
const Recaptcha = require("../lib/recaptcha");
const RequestFormSchema = require("./schema/request");
const AskFormSchema = require("./schema/ask");
const ValidateOrFail = require("../lib/validate");

const Ses = require("../lib/ses");
const Mailer = require('../lib/mailer');
const mailerService = new Mailer(Ses);

const Salesforce = require('../lib/salesforce');
const salesforceService = new Salesforce(
    process.env.RA_SALESFORCE_USERNAME,
    process.env.RA_SALESFORCE_PASSWORD
);

function sendExceptionEmail(ex, event, context) {
    let htmlBody = `<html><body><h3>${ex}</h3><p><pre>${JSON.stringify(ex.stack, null, 4)}</pre></p><p><strong>event:</strong><pre>${JSON.stringify(event, null, 4)}</pre></p><p><strong>context:</strong><pre>${JSON.stringify(context, null, 4)}</pre></p></body></html>`;
    let plainBody = `${ex}\n${JSON.stringify(ex.stack, null, 4)}\n\n\nevent:\n${JSON.stringify(event, null, 4)}\n\n\ncontext:\n${JSON.stringify(context, null, 4)}`;

    mailerService.send({
        to: [process.env.RA_EXCEPTION_EMAIL_NOTIFICATIONS],
        fromName: process.env.RA_FROM_NAME,
        fromEmail: process.env.RA_FROM_EMAIL,
        subject: `[${Date.now()}] rescueapp.es-api Error: ${ex}`,
        htmlBody: htmlBody,
        plainBody: plainBody,
    })
}

function isTest(event) {
    if (
        null !== event.queryStringParameters
        && 'queryStringParameters' in event
        && 'test' in event.queryStringParameters
        && Boolean(event.queryStringParameters.test)
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
            isTest? results : {},
            isTest? 200 : 201,
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
            isTest? results : {},
            isTest? 200 : 201,
        ));
    } catch (ex) {
        console.log('request.ask', 'error', ex);
        sendExceptionEmail(ex, event, context);

        callback(null, Response.createJsonErrorResponse(ex, 400));
    }
};
