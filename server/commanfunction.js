'use strict';

exports.responseapi = (req, executionstarttime, msgkey, status, dataArr, rowcount, statusdetails = {}) => {
    return ({
        status: status,
        status_code: statusdetails.code ? `s_${statusdetails.code}` : 's_001',
        data: dataArr,
        rowcount: rowcount,
        msgkey: msgkey,
        messagedetails: statusdetails
    })
}