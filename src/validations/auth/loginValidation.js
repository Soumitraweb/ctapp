const Joi = require('joi');

exports.validData = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(data, { abortEarly: false, allowUnknown: true});
    if (error) {
        const errors = error.details.reduce((acc, curr) => {
            acc[curr.path[0]] = curr.message.replace(/"/g, '').charAt(0).toUpperCase() + curr.message.replace(/"/g, '').slice(1);
            return acc;
        }, {});
        return { isValid: false, errors };
    }

    return { isValid: true, errors: {} };
};