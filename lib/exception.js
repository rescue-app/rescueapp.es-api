const Ses = require("./ses");
const Mailer = require('./mailer');
const mailerService = new Mailer(Ses);

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

module.exports = sendExceptionEmail;
