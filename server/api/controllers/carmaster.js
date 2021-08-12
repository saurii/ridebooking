const moment = require('moment');
const asyncHandler = require('../../utils/asynchandler')
const sendResponse = require('../../utils/response').sendResponse;
const errorlog = require('../../logger').ErrorLog;
const db = require('../../storage/models');
const sequelize = require('sequelize');

exports.addcar = asyncHandler(async(req, res, next) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    isAlreadyCarAllocated(req.body.usermasterid)
        .then((resGetUser) => {
            if (resGetUser) {
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '413', false);
            } else {
                let data = {}
                req.body.carno && req.body.carno !== null ? data.carno = req.body.carno.toLowerCase().trim() : null;
                req.body.longitude && req.body.longitude !== null ? data.longitude = req.body.longitude.trim() : null;
                req.body.latitude && req.body.latitude !== null ? data.latitude = req.body.latitude.trim() : null;
                req.body.usermasterid && req.body.usermasterid !== null ? data.usermasterid = req.body.usermasterid : null;
                data.ridestatus = 'available';
                data.createdby = req.body.createdby.toLowerCase().trim();
                data.createddate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                data.isactive = true;
                return db.carmaster
                    .create(data)
                    .then(() => {
                        return sendResponse(0, apiExecutionStarttime, req, res, [], [], '414', true);
                    }).catch((err) => {
                        if (err.original["code"].trim() === 'ER_DUP_ENTRY') {
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [{ key1: 'car no' }], '403', true);
                        } else {
                            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                        }
                    })
            }
        }).catch((err) => {
            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
        })
})

exports.getnearbycars = asyncHandler(async(req, res, next) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    return db.sequelize.query(`
    SELECT cm.carno as carno, um.name as drivername,um.mobileno as mobileno, ((ACOS(SIN(${req.query.latitude} * PI() / 180) * SIN(cm.latitude * PI() / 180) + COS(${req.body.latitude} * PI() / 180) 
    * COS(cm.latitude * PI() / 180) * COS((${req.query.longitude} - cm.longitude) * PI() / 180)) * 180 / PI()) * 60 * 1.1515 * 1.609344) 
    as distance FROM carmaster as cm 
    inner join usermaster as um on um.usermasterid = cm.usermasterid
    where cm.ridestatus = 'available'
    HAVING distance <= 4 ORDER BY distance ASC`, {
        type: sequelize.QueryTypes.SELECT
    }).then((resGetCabs) => {
        resGetCabs = JSON.parse(JSON.stringify(resGetCabs));
        if (resGetCabs && resGetCabs.length > 0) {
            return sendResponse(resGetCabs.length, apiExecutionStarttime, req, res, resGetCabs, [], '404', true);
        } else {
            return sendResponse(0, apiExecutionStarttime, req, res, resGetCabs, [], '405', false);
        }
    }).catch((err) => {
        insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
        return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
    })
})

function isAlreadyCarAllocated(usermasterid) {
    return new Promise((resolve, reject) => {
        return db.carmaster
            .findOne({
                attributes: ['usermasterid'],
                where: {
                    usermasterid: usermasterid,
                },
                raw: true
            }).then((resCheckUser) => {
                if (resCheckUser && resCheckUser.usermasterid) {
                    return resolve(true)
                } else {
                    return resolve(false)
                }
            }).catch((err) => {
                return reject(err);
            })
    })
}

function insertLogsData(req, apiExecutionStarttime, err, file, status) {
    return errorlog(req, apiExecutionStarttime, err, 'error', file, status);
}