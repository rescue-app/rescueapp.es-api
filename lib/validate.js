module.exports = (data, model) => {
    let validation = model.validate(data, {
        abortEarly: false,
        convert: true,
        allowUnknown: true,
        stripUnknown: { objects: true },
    });

    if (validation.error !== undefined) {
        throw new Error(validation.error.toString());
    }

    return validation.value;
};
