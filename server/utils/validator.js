const responseapi = require('../commanfunction').responseapi;
const Statuscodes = require('../utils/statuscodeconstant').Statuscodes;
const Joi = require('@hapi/joi');

module.exports = (schema, source) => (
    req,
    res,
    next,
) => {
    try {
        console.log('req', req.body)
        if (req.method.toLowerCase().trim() === 'get') {
            req.body = req.query
        }
        const { error } = schema.validate(req.body);
        console.log('schema', error)
        if (!error) return next();

        const { details } = error;
        const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');
        let statuscodeObj = new Statuscodes();
        return res.send(responseapi(req, new Date(), [], false, [{
            message: message
        }], 0, statuscodeObj.getStatusDetails('412')));
    } catch (error) {
        next(error);
    }
};