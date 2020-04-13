const ValidateOrFail = require("./validate");
const MailSchema = require("../src/schema/mail");
            
class Mailer {
    constructor(sendFunction) {
        this.sendFunction = sendFunction;
    }

    send(params) {
        let emailDetails;

        try {
            emailDetails = ValidateOrFail(params, MailSchema);
        } catch (error) {        
            return new Promise((resolve, reject) => reject(error));
        }

        return this.sendFunction(emailDetails)
    }
}

module.exports = Mailer;
