const joi = require('@hapi/joi');

module.exports.addcar = joi.object().keys({
    carno: joi.string().required().lowercase().trim(),
    longitude: joi.string().required().trim(),
    latitude: joi.string().required().trim(),
    usermasterid: joi.number().required().min(1),
    createdby: joi.string().required().lowercase().trim()
})

module.exports.nearbycabs = joi.object().keys({
    longitude: joi.number().required(),
    latitude: joi.number().required()
})