const Request = require('request');
const RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify";

const isHuman = (response) => {
    return new Promise(function(resolve, reject) {
        Request.post(
            RECAPTCHA_URL,
            {
                form: {
                    secret: process.env.RA_RECAPTCHA_PRIVATE_KEY,
                    response: response,
                }
            },
            function(error, response, body) {
                if (error || response.statusCode != 200) {
                    reject('Invalid recaptcha response');
                }

                let result = JSON.parse(body);
                if (result.success !== true) {
                    reject('Invalid recaptcha response');
                }
                
                resolve(body);
            }
        );
    });
}
    
module.exports.isHuman = isHuman;
