'use strict';
const objectResponse = require('./object');

module.exports.get = async (event, context, callback) => {
    return objectResponse.get(event, context, callback, true);
};
