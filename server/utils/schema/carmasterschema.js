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

module.exports.bookcab = joi.object().keys({
    pickup_longitude: joi.number().required(),
    pickup_latitude: joi.number().required(),
    drop_longitude: joi.number().required(),
    drop_latitude: joi.number().required(),
    rideamount: joi.number().required().min(1),
    usermasterid: joi.number().required().min(1),
    createdby: joi.string().required().lowercase().trim()
})

module.exports.updateridedetails = joi.object().keys({
    bookingotp: joi.string().required().lowercase().trim(),
    carno: joi.string().required().lowercase().trim(),
    action: joi.string().required().lowercase().trim().valid(['picked', 'dropped']),
    usermasterid: joi.number().required().min(1),
    lastmodifiedby: joi.string().required().lowercase().trim()
})