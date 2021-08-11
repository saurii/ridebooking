const responseapi = require('../commanfunction');
const Statuscodes = require('../utils/statuscodeconstant').Statuscodes;

module.exports = (schema, source) => (
    req,
    res,
    next,
) => {
    try {
        if (req.method.toLowerCase().trim() === 'get') {
            req[source] = req.query
        }
        const { error } = schema.validate(req[source]);
        if (!error) return next();

        const { details } = error;
        const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');
        let statuscodeObj = new Statuscodes();
        return res.send(responseapi(req, new Date(), [], false, [{
            message: message
        }], 0, statuscodeObj.getStatusDetails('414')));
    } catch (error) {
        next(error);
    }
};