const Form = require('../src/schema/form.js');

const getValidFormFromRequest = (data) => {
    let validation = Form.validate(data, {
        abortEarly: false,
        convert: true,
        allowUnknown: true,
        stripUnknown: { objects: true },
    });

    if (validation.error !== undefined) {
        throw new Error(validation.error.toString());
    }

    return validation.value;
}
    
module.exports.getValidFormFromRequest = getValidFormFromRequest;
