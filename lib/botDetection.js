const Request = require('request');
const RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify";

const isValidApiSecret = (token) => {
    if (!("RA_API_SECRETS" in process.env)) {
        return false;
    }

    if (!process.env.RA_API_SECRETS.split(':').includes(token)) {
        return false;
    }

    return true;
}

const isHumanOrFail = (response) => {
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
                    let message = "Invalid recaptcha response";

                    if (
                        "error-codes" in result
                        && Array.isArray(result["error-codes"])
                        && result["error-codes"].length > 0
                    ) {
                        message += `: ${result["error-codes"].join(", ")}`;
                    }
                    
                    reject(message);
                }
                
                resolve(body);
            }
        );
    });
}
    
module.exports.isHumanOrFail = isHumanOrFail;
module.exports.isValidApiSecret = isValidApiSecret;
