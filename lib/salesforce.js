const jsforce = require('jsforce');
const _ = require('underscore');
const SalesforceFields = require('./salesforceFields');
            
class Salesforce {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.connection = false;
    }

    async insertSObjectsFromAsk(askForm, test) {
        let originalObject;
        let isOffer;

        if (SalesforceFields.NEED_REGEX.test(askForm.reference)) {
            originalObject = await this._getNeedByReference(askForm.reference);
            isOffer = true;
        }

        if (SalesforceFields.OFFER_REGEX.test(askForm.reference)) {
            originalObject = await this._getOfferByReference(askForm.reference);
            isOffer = false;
        }

        let details = `[From request ${askForm.reference}]`;
        if ('details' in askForm && askForm.details !== undefined) {
            details += ` ${askForm.details}`;
        }
        
        askForm.stocks = [
            {
                quantity: test? 1234 : originalObject[SalesforceFields.FIELD_QUANTITY],
                other: test? 'Other Test Data' : originalObject[SalesforceFields.FIELD_OTHER],
                type: test? 'Type Test Data' : originalObject[SalesforceFields.FIELD_TYPE],
                details: details,
                isOffer: isOffer
            }
        ];

        return this.insertSObjectsFromForm(askForm, test);
    }

    async insertSObjectsFromForm(form, test) {
        let objects = this._getSalesforceSObjects(form);
        let offers = objects.filter(sobject => sobject['isOffer'] === true).map(function(o) {
            delete o.isOffer;
            
            return o
        });
        let needs = objects.filter(sobject => sobject['isOffer'] === false).map(function(o) {
            delete o.isOffer;
            
            return o
        });
        
        let connection = await this._getConnection();
        let promises = [];

        if (test) {
            return new Promise(resolve => {
                resolve({
                    [SalesforceFields.OFFER_SOBJECT_NAME]: offers,
                    [SalesforceFields.NEED_SOBJECT_NAME]: needs,
                });
            });
        }

        if (offers.length > 0) {
            promises.push(connection.sobject(SalesforceFields.OFFER_SOBJECT_NAME).create(offers))
        }

        if (needs.length > 0) {
            promises.push(connection.sobject(SalesforceFields.NEED_SOBJECT_NAME).create(needs))
        }

        return Promise.all(promises);
    }

    _getSalesforceSObjects(form) {        
        return form.stocks.map(stock => {
            return {
                [SalesforceFields.FIELD_ACCOUNT_NAME]: form.account || form.name,
                [SalesforceFields.FIELD_CITY]: form.city,
                [SalesforceFields.FIELD_CONTACT_NAME]: form.name,
                [SalesforceFields.FIELD_CONTACT_EMAIL]: form.email,
                [SalesforceFields.FIELD_CONTACT_JOINS]: form.join? "1" : "0",
                [SalesforceFields.FIELD_CONTACT_PHONE]: form.phone,
                [SalesforceFields.FIELD_CONTACT_POSTAL_CODE]: form.postalCode,
                [SalesforceFields.FIELD_CONTACT_TYPE]: form.contactType,
                [SalesforceFields.FIELD_CONTACT_STREET]: form.street,
                [SalesforceFields.FIELD_QUANTITY]: stock.quantity,
                [SalesforceFields.FIELD_DETAILS]: stock.details,
                [SalesforceFields.FIELD_OTHER]: stock.other,
                [SalesforceFields.FIELD_STATUS]: SalesforceFields.FIELD_STATUS_PICKLIST_NEW,
                [SalesforceFields.FIELD_TYPE]: stock.type,
                [SalesforceFields.FIELD_RELATED_OBJECT]: "reference" in form ? form.reference : undefined,
                isOffer: stock.isOffer,
            }
        });
    }

    getObject(reference) {
        let result;
        if (SalesforceFields.NEED_REGEX.test(reference)) {
            return this._getNeedByReference(reference);
        }

        if (!result && SalesforceFields.OFFER_REGEX.test(reference)) {
            return this._getOfferByReference(reference);
        }

        throw new Error(`Reference '${reference}' is invalid`);
    }

    _getNeedByReference(reference) {
        return this._getSObjectByReference(reference, SalesforceFields.NEED_SOBJECT_NAME, SalesforceFields.NEED_REGEX);
    }

    _getOfferByReference(reference) {
        return this._getSObjectByReference(reference, SalesforceFields.OFFER_SOBJECT_NAME, SalesforceFields.OFFER_REGEX);
    }

    _getConnection() {
        return new Promise(resolve => {
            if (this.connection) {
                resolve(this.connection)
            }
            
            this.connection = new jsforce.Connection({});
            this.connection.login(this.username, this.password, () => resolve(this.connection));
        });
    }

    _getOmitFields() {
        return [
            SalesforceFields.FIELD_SALESFORCE_OWNER_ID,
            SalesforceFields.FIELD_SALESFORCE_IS_DELETED,
            SalesforceFields.FIELD_SALESFORCE_CREATED_BY_ID,
            SalesforceFields.FIELD_SALESFORCE_LAST_MODIFIED_BY_ID,
        ];
    }

    _getAllFields() {
        return {
            [SalesforceFields.FIELD_ACCOUNT_NAME]: true,
            [SalesforceFields.FIELD_CITY]: true,
            [SalesforceFields.FIELD_CONTACT_NAME]: true,
            [SalesforceFields.FIELD_CONTACT_EMAIL]: true,
            [SalesforceFields.FIELD_CONTACT_JOINS]: true,
            [SalesforceFields.FIELD_CONTACT_PHONE]: true,
            [SalesforceFields.FIELD_CONTACT_POSTAL_CODE]: true,
            [SalesforceFields.FIELD_CONTACT_STREET]: true,
            [SalesforceFields.FIELD_CONTACT_TYPE]: true,
            [SalesforceFields.FIELD_QUANTITY]: true,
            [SalesforceFields.FIELD_DETAILS]: true,
            [SalesforceFields.FIELD_STATUS]: true,
            [SalesforceFields.FIELD_OTHER]: true,
            [SalesforceFields.FIELD_TYPE]: true,
        };
    }

    async _getSObjectByReference(reference, objectName, regexPattern) {
        reference = reference.trim();
        if (!regexPattern.test(reference)) {
            throw 'Invalid reference provided';
        }

        return (await this._getConnection()).sobject(objectName).find({ [SalesforceFields.FIELD_REFERENCE]: reference }, '*').limit(1).execute((err, results) => {
            if (err) {
                throw err;
            }

            if (!Array.isArray(results) || results.length !== 1) {
                throw `${objectName} with reference ${reference} was not found in Salesforce`;
            }

            return _.omit(results[0], this._getOmitFields());
        });        
    }
}

module.exports = Salesforce;
