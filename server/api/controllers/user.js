const moment = require('moment');
const asyncHandler = require('../../utils/asynchandler')
const sendResponse = require('../../utils/response').sendResponse;
exports.createuser = asyncHandler(async(req, res, next) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    return sendResponse(0, apiExecutionStarttime, req, res, [], [{ key1: 'username' }], '403', false);
})