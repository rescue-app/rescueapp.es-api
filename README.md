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
            "type": "offer",
            "details": "Guantes",
            "other": null
        },
        {
            "quantity": "20",
            "type": "need",
            "details": "Mascarillas",
            "other": null
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
            "Detalles__c": "Guantes",
            "Otros__c": null,
            "Estado__c": "Nueva",
            "Tipo__c": "Oferta"
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
            "Detalles__c": "Mascarillas",
            "Otros__c": null,
            "Estado__c": "Nueva",
            "Tipo__c": "Necesidad"
        }
    ]
}
```
## Ask for existing need/offer
**Send Salesforce referenc in `reference` field (O-12345 for Offers or N-123456 for Needs)**
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
            "Detalles__c": "(From request O-00100) - Test Data",
            "Otros__c": "Other Test Data",
            "Estado__c": "Nueva",
            "Tipo__c": "Necesidad"
        }
    ]
}
```
