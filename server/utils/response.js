const Statuscodes = require('./statuscodeconstant').Statuscodes;
const responseapi = require('../commanfunction').responseapi;
module.exports.sendResponse = (rowcount, apiExecutionStarttime, req, res, data, msgkey, statuscode, status) => {
    let statuscodeObj = new Statuscodes();
    return res.send(responseapi(req, apiExecutionStarttime, msgkey, status, data, rowcount, statuscodeObj.getStatusDetails(statuscode)))
}