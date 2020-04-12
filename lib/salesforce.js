const jsforce = require('jsforce');
const _ = require('underscore');

const NEED_REGEX = /^N-[0-9]{6}$/;
const NEED_SOBJECT_NAME = 'Necesidad__c';
const OFFER_REGEX = /^O-[0-9]{5}$/;
const OFFER_SOBJECT_NAME = 'Oferta__c';

const FIELD_SALESFORCE_ATTRIBUTES = 'attributes';
const FIELD_SALESFORCE_OWNER_ID = 'OwnerId';
const FIELD_SALESFORCE_IS_DELETED = 'IsDeleted';
const FIELD_SALESFORCE_CREATED_BY_ID = 'CreatedById';
const FIELD_SALESFORCE_LAST_MODIFIED_BY_ID = 'LastModifiedById';

const FIELD_ACCOUNT_NAME = 'aux_accountName__c'; // Text(200): Nombre de empresa / cuenta. Si es un particular, se sugiere enviar la misma información que aux_ContactName
const FIELD_CITY = 'aux_city__c'; // Text(200): Ciudad
const FIELD_CONTACT_NAME = 'aux_contactName__c'; // Text(255): Nombre del contacto
const FIELD_CONTACT_EMAIL = 'aux_email__c'; // Text(200): Email de contacto
const FIELD_CONTACT_JOINS = 'aux_join__c'; // Text(1): 1 - Se quiere unir al equipo, 0 - No se quiere unir no se quiere unir
const FIELD_CONTACT_PHONE = 'aux_phone__c'; // Text(1): Teléfono
const FIELD_CONTACT_POSTAL_CODE = 'aux_postalCode__c'; // Text(100): Código postal
const FIELD_CONTACT_ADDRESS = 'aux_street__c'; // Text(255): Calle y número
const FIELD_CONTACT_TYPE = 'aux_typeContact__c'; // Text(255): Tipo de contacto     
const FIELD_QUANTITY = 'Cantidad__c'; // Number(9,0): Cantidad necesdtad / oferta
const FIELD_DETAILS = 'Detalles__c'; // Text Area(255): Detalles de la necesidad / Oferta
const FIELD_STATUS = 'Estado__c'; // Picklist: Informar siempre Nueva (Como String)
const FIELD_OTHER = 'Otros__c'; // Textarea(255): Descripción cuanto el tipo es otros
const FIELD_TYPE = 'Tipo__c'; // Picklist: Tipo de necesidad / Oferta (Informar como String)     
            
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

    _getOmitFields() {
        return [
            FIELD_SALESFORCE_ATTRIBUTES,
            FIELD_SALESFORCE_OWNER_ID,
            FIELD_SALESFORCE_IS_DELETED,
            FIELD_SALESFORCE_CREATED_BY_ID,
            FIELD_SALESFORCE_LAST_MODIFIED_BY_ID,
        ];
    }

    _getAllFields() {
        return {
            [FIELD_ACCOUNT_NAME]: true,
            [FIELD_CITY]: true,
            [FIELD_CONTACT_NAME]: true,
            [FIELD_CONTACT_EMAIL]: true,
            [FIELD_CONTACT_JOINS]: true,
            [FIELD_CONTACT_PHONE]: true,
            [FIELD_CONTACT_POSTAL_CODE]: true,
            [FIELD_CONTACT_ADDRESS]: true,
            [FIELD_CONTACT_TYPE]: true,
            [FIELD_QUANTITY]: true,
            [FIELD_DETAILS]: true,
            [FIELD_STATUS]: true,
            [FIELD_OTHER]: true,
            [FIELD_TYPE]: true,
        };
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

            return _.omit(results[0], this._getOmitFields());
        });        
    }
}

module.exports = Salesforce;
