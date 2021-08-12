const moment = require('moment');
const fs = require('fs');
const path = require('path');
module.exports.ErrorLog = (req, apiexecutionstarttime, errordetails, logtype, functionname, status) => {
    let logObj = {
        Time: "",
        Status: status,
        response_message: "",
        Function: functionname,
        ExecutionStartTime: moment(apiexecutionstarttime).format('YYYY-MM-DD HH:mm:ss'),
        ExecutionEndTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        Params: JSON.stringify(req.body),
        ExecutionLaps: "",
        system: "ridebooking",
        level: "",
        error: errordetails ? errordetails : null,
        url: req.originalUrl ? req.originalUrl : null,
        application: "ridebooking",
        logtype: logtype,
        subsystem: "backend",
        message: ""
    }
    return addErrorLogstoFile(logObj);
}

function addErrorLogstoFile(errorData) {
    let todayDate = moment(new Date()).format('YYYY-MM-DD') + ".json";
    if (fs.existsSync(path.join(process.cwd(), "/server/errorlogs/" + todayDate))) {
        fs.appendFile(path.join(process.cwd(), "/server/errorlogs/" + todayDate), JSON.stringify(errorData) + "\n", (err) => {
            if (err) console.error(err);
        });
    } else {
        fs.writeFile(path.join(process.cwd(), "/server/errorlogs/" + todayDate), JSON.stringify(errorData) + "\n", (err) => {
            if (err) console.error(err);
        });
    }
    return true;
}