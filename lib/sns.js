const Aws = require('aws-sdk');
const Sns = new Aws.SNS();

module.exports = (subject, message = {}) => {    
    return Sns.publish({
        Subject: `[${Date.now()}] ${subject}`,
        Message: JSON.stringify(message, undefined, 4), 
        TopicArn: process.env.RA_AWS_SNS_NOTIFICATIONS_TOPIC
    }).promise();
};
