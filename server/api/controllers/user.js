const moment = require('moment');
const asyncHandler = require('../../utils/asynchandler')
const sendResponse = require('../../utils/response').sendResponse;
const errorlog = require('../../logger').ErrorLog;
const db = require('../../storage/models');
const jwt = require('jsonwebtoken');
const config = require('../../config/index')._config;

exports.createuser = asyncHandler(async(req, res, next) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    isEmailAddressExist(req.body.emailaddress)
        .then((resGetEmail) => {
            if (resGetEmail) {
                return sendResponse(0, apiExecutionStarttime, req, res, [], [{ key1: 'emailaddress' }], '403', false);
            } else {
                let data = {}
                req.body.name && req.body.name !== null ? data.name = req.body.name.toLowerCase().trim() : null;
                req.body.roleid && req.body.roleid !== null ? data.roleid = req.body.roleid : null;
                req.body.mobileno && req.body.mobileno !== null ? data.mobileno = req.body.mobileno.trim() : null;
                req.body.address && req.body.address !== null ? data.address = req.body.address.toLowerCase().trim() : null;
                req.body.emailaddress && req.body.emailaddress !== null ? data.emailaddress = req.body.emailaddress.toLowerCase().trim() : null;
                req.body.password && req.body.password !== null ? data.password = req.body.password.trim() : null;
                data.createdby = req.body.emailaddress.toLowerCase().trim();
                data.createddate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                data.isactive = true;
                return db.usermaster
                    .create(data)
                    .then(() => {
                        return sendResponse(0, apiExecutionStarttime, req, res, [], [{ key1: 'user' }], '402', true);
                    }).catch((err) => {
                        if (err.original["code"].trim() === 'ER_DUP_ENTRY') {
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [{ key1: 'mobileno' }], '403', true);
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

exports.login = asyncHandler(async(req, res, next) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    return db.usermaster
        .findOne({
            attributes: ['name', 'emailaddress', 'mobileno', 'address'],
            where: {
                mobileno: req.body.mobileno.trim(),
                password: req.body.password.trim()
            },
            raw: true
        })
        .then((resUser) => {
            if (resUser && Object.keys(resUser).length > 0) {
                generateToken(resUser.emailaddress).then((resGetToken) => {
                    resUser.token = resGetToken;
                    return sendResponse(1, apiExecutionStarttime, req, res, [resUser], [], '408', true);
                })
            } else {
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '409', false);
            }
        }).catch((err) => {
            if (err.original["code"].trim() === 'ER_DUP_ENTRY') {
                return sendResponse(0, apiExecutionStarttime, req, res, [], [{ key1: 'mobileno' }], '403', true);
            } else {
                insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
            }
        })
})

function generateToken(user) {
    return new Promise((resolve, reject) => {
        let today = new Date().toJSON().split('T');
        const Token = jwt.sign({
            emailaddress: user.toString(),
            date: today[0] // only date
        }, config.internals.projectsecretkey, {
            expiresIn: 86400 // expires in 24 hours
        });

        return resolve(Token);
    })
}

function isEmailAddressExist(emailaddress) {
    return new Promise((resolve, reject) => {
        return db.usermaster
            .findOne({
                attributes: ['emailaddress'],
                where: {
                    emailaddress: emailaddress.toLowerCase().trim()
                },
                raw: true
            }).then((resCheckEmail) => {
                if (resCheckEmail && resCheckEmail.emailaddress) {
                    return resolve(true)
                } else {
                    return resolve(false)
                }
            }).catch((err) => {
                return reject(err);
            })
    })
}

exports.getridedetails = asyncHandler(async(req, res, next) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    return db.ridehistory
        .findAndCountAll({
            attributes: ['pickup_longitude', 'pickup_latitude', 'drop_longitude', 'drop_latitude', 'rideamount', 'status', 'isactive', 'createddate'],
            where: {
                usermasterid: Number(req.query.usermasterid)
            },
            offset: (Number(req.query.page) - 1) * Number(req.query.pagesize),
            limit: Number(req.query.pagesize),
            include: [{
                attributes: ['carno'],
                model: db.carmaster
            }],
            subQuery: false,
            order: [
                ['createddate', 'DESC']
            ],
            raw: true
        }).then((resGetRides) => {
            if (resGetRides && resGetRides.rows.length) {
                let arr = [];
                resGetRides.rows.forEach(element => {
                    arr.push({
                        pickup_longitude: element.pickup_longitude,
                        pickup_latitude: element.pickup_latitude,
                        drop_longitude: element.drop_latitude,
                        rideamount: element.rideamount,
                        status: element.status,
                        isactive: Boolean(element.isactive),
                        createddate: element.createddate,
                        carno: element['carmaster.carno'] ? element['carmaster.carno'] : null
                    })
                })
                return sendResponse(resGetRides.count, apiExecutionStarttime, req, res, arr, [], '404', true);
            } else {
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '405', false);
            }
        }).catch((err) => {
            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
        })
})

function insertLogsData(req, apiExecutionStarttime, err, file, status) {
    return errorlog(req, apiExecutionStarttime, err, 'error', file, status);
}