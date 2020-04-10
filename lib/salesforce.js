const jsforce = require('jsforce');
const _ = require('underscore');

const NEED_REGEX = /^N-[0-9]{6}$/;
const NEED_SOBJECT_NAME = 'Necesidad__c';
const OFFER_REGEX = /^O-[0-9]{5}$/;
const OFFER_SOBJECT_NAME = 'Oferta__c';

class Salesforce {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.connection = false;
    }

    getNeedByReference(reference) {
        return this._getSObjectByReference(reference, NEED_SOBJECT_NAME, NEED_REGEX);
    }

    getOfferByReference(reference) {
        return this._getSObjectByReference(reference, OFFER_SOBJECT_NAME, OFFER_REGEX);
    }

    _getConnection() {
        return new Promise((resolve) => {
            if (this.connection) {
                resolve(this.connection)
            }
            
            this.connection = new jsforce.Connection({});
            this.connection.login(this.username, this.password, () => resolve(this.connection));
        });
    }

    async _getSObjectByReference(reference, objectName, regexPattern) {
        reference = reference.trim();
        if (!regexPattern.test(reference)) {
            throw 'Invalid reference provided';
        }

        return (await this._getConnection()).sobject(objectName).find({ Name: reference }, '*').limit(1).execute((err, results) => {
            if (err) {
                throw err;
            }
            if (!Array.isArray(results) || results.length !== 1) {
                throw `${objectName} with reference ${reference} was not found in Salesforce`;
            }

            return _.pick(results[0], ['Id', 'Name', ]);
        });        
    }
}

module.exports = Salesforce;
