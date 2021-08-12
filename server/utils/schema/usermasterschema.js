const joi = require('@hapi/joi');

module.exports.createusermaster = joi.object().keys({
    name: joi.string().required().lowercase().trim(),
    roleid: joi.number().required().min(1),
    mobileno: joi.string().required().trim(),
    address: joi.string().required().lowercase().trim().allow(null),
    emailaddress: joi.string().required().lowercase().trim(),
    password: joi.string().required().trim(),
    createdby: joi.string().required().trim()
})