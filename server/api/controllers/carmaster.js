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
            return sendResponse(0, apiExecutionStarttime, req, res, resGetCabs, [], '415', false);
        }
    }).catch((err) => {
        insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
        return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
    })
})

exports.bookcar = asyncHandler(async(req, res, next) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    isAlreadyCabBooked(req.body.usermasterid)
        .then((resExist) => {
            if (resExist) {
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '417', false);
            } else {
                getNearByCab(req.body.pickup_longitude, req.body.pickup_latitude)
                    .then((resGetCab) => {
                        if (resGetCab.length === 0) {
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '415', false);
                        } else {
                            let carData = {
                                ridestatus: 'booked',
                                lastmodifiedby: req.body.createdby,
                                lastmodifieddate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                            }
                            let carWhrObj = {
                                carmasterid: resGetCab[0].carmasterid
                            }
                            let promiseArr = [];
                            promiseArr.push(updateCarDetails(carData, carWhrObj));

                            let bookingotp = getBookingOTP(resGetCab[0].carmasterid);

                            let data = {}
                            data.carmasterid = resGetCab[0].carmasterid;
                            data.bookingotp = bookingotp
                            data.pickup_latitude = req.body.pickup_latitude.toString().trim();
                            data.pickup_longitude = req.body.pickup_longitude.toString().trim();
                            data.drop_longitude = req.body.drop_longitude.toString().trim();
                            data.drop_latitude = req.body.drop_latitude.toString().trim();
                            data.rideamount = req.body.rideamount;
                            data.usermasterid = req.body.usermasterid;
                            data.status = 'booked';
                            data.createdby = req.body.createdby.toLowerCase().trim();
                            data.createddate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                            data.isactive = true;
                            promiseArr.push(insertRideHistory(data));

                            Promise.all(promiseArr)
                                .then(() => {
                                    return sendResponse(1, apiExecutionStarttime, req, res, [{
                                        bookingotp: bookingotp,
                                        driverno: resGetCab[0].mobileno,
                                        drivername: resGetCab[0].drivername,
                                        carno: resGetCab[0].carno,
                                    }], [], '416', true);
                                }).catch((err) => {
                                    carData.ridestatus = 'available';
                                    updateCarDetails(carData, carWhrObj)
                                        .then(() => {
                                            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                                            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                                        }).catch((err) => {
                                            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                                            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                                        })
                                })
                        }
                    }).catch((err) => {
                        insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                        return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                    })
            }
        }).catch((err) => {
            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
        })
})

exports.updateridedetails = asyncHandler(async(req, res, next) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    let whrObj = {
        bookingotp: req.body.bookingotp.trim(),
        usermasterid: req.body.usermasterid
    }
    isCabBooked(whrObj)
        .then((resGetCab) => {
            if (resGetCab && Object.keys(resGetCab).length === 0) {
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '418', false);
            } else if (resGetCab && Object.keys(resGetCab).length > 0) {
                if (resGetCab.status === 'on way' && req.body.action === 'picked') {
                    return sendResponse(0, apiExecutionStarttime, req, res, [], [{
                        key1: 'ride is already on the way'
                    }], '420', false);
                } else if (resGetCab.status === 'completed' && req.body.action === 'dropped') {
                    return sendResponse(0, apiExecutionStarttime, req, res, [], [{
                        key1: 'ride is already completed'
                    }], '420', false);
                } else {
                    if ((req.body.action === 'picked' && resGetCab.status === 'booked') ||
                        (req.body.action === 'dropped' && resGetCab.status === 'on way')) {
                        let carData = {}
                        carData.ridestatus = req.body.action === 'picked' ? 'on way' : 'available';
                        carData.lastmodifiedby = req.body.lastmodifiedby.toLowerCase().trim();
                        carData.lastmodifieddate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

                        let carWhrObj = {
                            carno: req.body.carno.toLowerCase().trim()
                        }

                        updateCarDetails(carData, carWhrObj)
                            .then((resCabUpdate) => {
                                let rideDetails = {
                                    status: req.body.action === 'picked' ? 'on way' : 'completed',
                                    lastmodifiedby: req.body.lastmodifiedby.toLowerCase().trim(),
                                    lastmodifieddate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                    isactive: req.body.action === 'picked' ? true : false,
                                }

                                let rideWhrObj = {
                                    bookingotp: req.body.bookingotp.trim()
                                }
                                updateRideDetails(rideDetails, rideWhrObj)
                                    .then(() => {
                                        return sendResponse(0, apiExecutionStarttime, req, res, [], [{
                                            key1: req.body.action === 'picked' ? 'on way' : 'completed'
                                        }], '419', true);
                                    }).catch((err) => {
                                        insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                                        return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                                    })
                            }).catch((err) => {
                                insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                            })
                    } else {
                        return sendResponse(0, apiExecutionStarttime, req, res, [], [{
                            key1: 'invalid ride'
                        }], '420', false);
                    }
                }
            }
        }).catch((err) => {
            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
        })
})

function isAlreadyCabBooked(usermasterid) {
    return new Promise((resolve, reject) => {
        let data = {};
        data.usermasterid = usermasterid;
        data.status = ['booked', 'on way']
        return db.ridehistory
            .findOne({
                attributes: ['usermasterid'],
                where: data,
                raw: true
            }).then((resGetRide) => {
                if (resGetRide && resGetRide.usermasterid) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            }).catch((err) => {
                return reject(err);
            })
    })
}

function updateCarDetails(data, whereObj) {
    return new Promise((resolve, reject) => {
        return db.carmaster
            .update(data, {
                where: whereObj
            }).then(() => {
                return resolve(true);
            }).catch((err) => {
                return reject(err);
            })
    })
}

function updateRideDetails(data, whereObj) {
    return new Promise((resolve, reject) => {
        return db.ridehistory
            .update(data, {
                where: whereObj
            }).then(() => {
                return resolve(true);
            }).catch((err) => {
                return reject(err);
            })
    })
}

function insertRideHistory(data) {
    return new Promise((resolve, reject) => {
        return db.ridehistory
            .create(data)
            .then(() => {
                return resolve(true);
            }).catch((err) => {
                return reject(err);
            })
    })
}

function getBookingOTP(carmasterid) {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 5; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    OTP += carmasterid;
    return OTP;
}

function isCabBooked(whereObj) {
    return new Promise((resolve, reject) => {
        return db.ridehistory
            .findOne({
                attributes: ['status'],
                where: whereObj,
                raw: true
            }).then((resCheckCabBooked) => {
                if (resCheckCabBooked && resCheckCabBooked.status) {
                    return resolve(resCheckCabBooked);
                } else {
                    return resolve({});
                }
            }).catch((err) => {
                return reject(err);
            })
    })
}

function getNearByCab(longitude, latitude) {
    return new Promise((resolve, reject) => {
        return db.sequelize.query(`
    SELECT cm.carno as carno, cm.carmasterid as carmasterid, um.name as drivername,um.mobileno as mobileno, ((ACOS(SIN(${latitude} * PI() / 180) * SIN(cm.latitude * PI() / 180) + COS(${latitude} * PI() / 180) 
    * COS(cm.latitude * PI() / 180) * COS((${longitude} - cm.longitude) * PI() / 180)) * 180 / PI()) * 60 * 1.1515 * 1.609344) 
    as distance FROM carmaster as cm 
    inner join usermaster as um on um.usermasterid = cm.usermasterid
    where cm.ridestatus = 'available'
    HAVING distance <= 4 ORDER BY distance ASC limit 1`, {
            type: sequelize.QueryTypes.SELECT
        }).then((resGetCab) => {
            resGetCab = JSON.parse(JSON.stringify(resGetCab));
            if (resGetCab && resGetCab.length > 0) {
                return resolve(resGetCab);
            } else {
                return resolve([]);
            }
        }).catch((err) => {
            return reject(err);
        })
    })
}

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