module.exports = Object.freeze({
    NEED_REGEX: /^N-[0-9]{6}$/i,
    NEED_SOBJECT_NAME: 'Necesidad__c',
    OFFER_REGEX: /^O-[0-9]{5}$/i,
    OFFER_SOBJECT_NAME: 'Oferta__c',

    FIELD_STATUS_PICKLIST_NEW: 'Nueva',

    FIELD_SALESFORCE_OWNER_ID: 'OwnerId',
    FIELD_SALESFORCE_IS_DELETED: 'IsDeleted',
    FIELD_SALESFORCE_CREATED_BY_ID: 'CreatedById',
    FIELD_SALESFORCE_CREATED_DATE: 'CreatedDate',
    FIELD_SALESFORCE_LAST_MODIFIED_BY_ID: 'LastModifiedById',

    FIELD_ID: 'Id', // Text(200): Nombre de empresa / cuenta. Si es un particular, se sugiere enviar la misma información que aux_ContactName
    FIELD_REFERENCE: 'Name', // Text(200): Nombre de empresa / cuenta. Si es un particular, se sugiere enviar la misma información que aux_ContactName
    FIELD_ACCOUNT_NAME: 'aux_accountName__c', // Text(200): Nombre de empresa / cuenta. Si es un particular, se sugiere enviar la misma información que aux_ContactName
    FIELD_CITY: 'aux_city__c', // Text(200): Ciudad
    FIELD_CONTACT_NAME: 'aux_contactName__c', // Text(255): Nombre del contacto
    FIELD_CONTACT_EMAIL: 'aux_email__c', // Text(200): Email de contacto
    FIELD_CONTACT_JOINS: 'aux_join__c', // Text(1): 1 - Se quiere unir al equipo, 0 - No se quiere unir no se quiere unir
    FIELD_CONTACT_PHONE: 'aux_phone__c', // Text(1): Teléfono
    FIELD_CONTACT_POSTAL_CODE: 'aux_postalCode__c', // Text(100): Código postal
    FIELD_CONTACT_STREET: 'aux_street__c', // Text(255): Calle y número
    FIELD_CONTACT_TYPE: 'aux_typeContact__c', // Text(255): Tipo de contacto     
    FIELD_QUANTITY: 'Cantidad__c', // Number(9,0): Cantidad necesdtad / oferta
    FIELD_DETAILS: 'Detalles__c', // Text Area(255): Detalles de la necesidad / Oferta
    FIELD_STATUS: 'Estado__c', // Picklist: Informar siempre Nueva (Como String)
    FIELD_OTHER: 'Otros__c', // Textarea(255): Descripción cuanto el tipo es otros
    FIELD_TYPE: 'Tipo__c', // Picklist: Tipo de necesidad / Oferta (Informar como String)     
});
