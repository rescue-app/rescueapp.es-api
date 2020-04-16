# Rescueapp API
Basic API implementation to connect to [Rescueapp](https://rescueapp.es) Salesforce instance using [Serverless](https://serverless.com/) and [AWS](https://aws.amazon.com/).
![Rescueapp](https://rescueapp.es/_nuxt/img/6d47846.jpg)

## Insert new need/offer
**(Max. 3 elements in stocks array)**
**POST** `/request` 
```json
{
    "name": "Luís López",
    "email": "luis-lopez@gmail.com",
    "account": "Luís López",
    "city": "Madrid",
    "join": true,
    "phone": "+34 600 000 000",
    "postalCode": "28080",
    "street": "Gran Vía, 10",
    "contactType": "Universidad",
    "challenge": "recaptcha-challenge-response",
    "stocks": [
        {
            "quantity": "100",
            "type": "Guantes",
            "details": "Ofrezco guantes grandes",
            "other": null,
            "isOffer": true
        },
        {
            "quantity": "20",
            "type": "Mascarillas",
            "details": "Necesitaría mascarillas de forma urgente",
            "other": null,
            "isOffer": false
        }
    ]
}
```
Will return **201** when success.
If you want to test this endpoint, request with `test=1`, it will not call Salesforce, and will show Salesforce request example:
```json
{
    "Oferta__c": [
        {
            "aux_accountName__c": "Luís Test López",
            "aux_city__c": "Madrid",
            "aux_contactName__c": "Luís Test López",
            "aux_email__c": "test-email@gmail.com",
            "aux_join__c": "0",
            "aux_phone__c": "+34600000000",
            "aux_postalCode__c": "28080",
            "aux_typeContact__c": "Universidad",
            "aux_street__c": "Gran Test, 10",
            "Cantidad__c": 100,
            "Detalles__c": "Ofrezco guantes grandes",
            "Otros__c": null,
            "Estado__c": "Nueva",
            "Tipo__c": "Guantes"
        }
    ],
    "Necesidad__c": [
        {
            "aux_accountName__c": "Luís Test López",
            "aux_city__c": "Madrid",
            "aux_contactName__c": "Luís Test López",
            "aux_email__c": "test-email@gmail.com",
            "aux_join__c": "0",
            "aux_phone__c": "+34600000000",
            "aux_postalCode__c": "28080",
            "aux_typeContact__c": "Universidad",
            "aux_street__c": "Gran Test, 10",
            "Cantidad__c": 20,
            "Detalles__c": "Necesitaría mascarillas de forma urgente",
            "Otros__c": null,
            "Estado__c": "Nueva",
            "Tipo__c": "Mascarillas"
        }
    ]
}
```
## Ask for existing need/offer
**Send Salesforce reference in `reference` field (O-12345 for Offers or N-123456 for Needs)**
**POST** `/ask` 
```json
{
    "name": "Luís López",
    "email": "luis-lopez@gmail.com",
    "account": "Luís López",
    "city": "Madrid",
    "join": true,
    "phone": "+34 600 000 000",
    "postalCode": "28080",
    "street": "Gran Vía, 10",
    "contactType": "Universidad",
    "challenge": "recaptcha-challenge-response",
    "details": "Los necesito mucho",
    "reference": "O-00100"
}
```
Will return **201** when success.
If you want to test this endpoint, request with `test=1`, it will not call Salesforce, and will show Salesforce request example:
```json
{
    "Oferta__c": [],
    "Necesidad__c": [
        {
            "aux_accountName__c": "Luís López",
            "aux_city__c": "Madrid",
            "aux_contactName__c": "Luís López",
            "aux_email__c": "luis-lopez@gmail.com",
            "aux_join__c": "0",
            "aux_phone__c": "+34600000000",
            "aux_postalCode__c": "28080",
            "aux_typeContact__c": "Universidad",
            "aux_street__c": "Gran Vía, 10",
            "Cantidad__c": 1234,
            "Detalles__c": "[From request O-00100] Los necesito mucho",
            "Otros__c": "Other Test Data",
            "Estado__c": "Nueva",
            "Tipo__c": "Type Test Data"
        }
    ]
}
```
## Ask for existing need/offer
**Send Salesforce reference in `reference` field (O-12345 for Offers or N-123456 for Needs)**
In case of error, you will get this type of message:
```json
{
    "error": "ValidationError: \"account\" is required. \"name\" is required. \"email\" is required",
    "details": [
        "\"account\" is required",
        "\"name\" is required",
        "\"email\" is required"
    ]
}
```
Details may be missing if there are no more data to show
