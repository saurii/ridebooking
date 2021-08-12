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

function insertLogsData(req, apiExecutionStarttime, err, file, status) {
    return errorlog(req, apiExecutionStarttime, err, 'error', file, status);
}