module.exports = (data, model) => {
    let validation = model.validate(data, {
        abortEarly: false,
        convert: true,
        allowUnknown: true,
        stripUnknown: { objects: true },
    });

    if (validation.error !== undefined) {
        throw validation.error;
    }

    return validation.value;
};
