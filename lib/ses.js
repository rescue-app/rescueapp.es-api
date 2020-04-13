const Aws = require('aws-sdk');
const Ses = new Aws.SES({ region: process.env.RA_AWS_DEPLOYMENT_REGION });

module.exports = (email)  => {  
    const fromBase64 = Buffer.from(email.fromName).toString('base64');
    const sesParams = {
        Destination: {
            ToAddresses: email.to,
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: email.htmlBody,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: email.plainBody
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: email.subject,
            },
        },
        Source: `=?utf-8?B?${fromBase64}?= <${email.fromEmail}>`,
    };
  
    return Ses.sendEmail(sesParams).promise();
};
