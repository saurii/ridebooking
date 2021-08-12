const responseapi = require('../../commanfunction').responseapi;
const Statuscodes = require('../../utils/statuscodeconstant').Statuscodes;
const decode = require('jwt-decode');

module.exports = () => (
    req,
    res,
    next,
) => {
    try {
        let statuscodeObj = new Statuscodes();
        if (!req.headers.authorization || req.headers.authorization === undefined) {
            return res.send(responseapi(req, new Date(), [], false, [], 0, statuscodeObj.getStatusDetails('401')));
        } else {
            let decoded;
            try {
                decoded = decode(req.headers.authorization);
            } catch (error) {
                return res.send(responseapi(req, new Date(), [], false, [], 0, statuscodeObj.getStatusDetails('401')));
            }
            if (decoded.exp === undefined)
                return res.send(responseapi(req, new Date(), [], false, [], 0, statuscodeObj.getStatusDetails('401')));
            else {
                const date = new Date(0);
                date.setUTCSeconds(decoded.exp);
                if (date === undefined) {
                    return res.send(responseapi(req, new Date(), [], false, [], 0, statuscodeObj.getStatusDetails('401')));
                } else if (date.valueOf() < new Date().valueOf()) {
                    return res.send(responseapi(req, new Date(), [], false, [], 0, statuscodeObj.getStatusDetails('401')));
                } else {
                    next();
                }
            }
        }
    } catch (error) {
        return res.send(responseapi(req, new Date(), [], false, [], 0, statuscodeObj.getStatusDetails('401')));
    }
};