'use strict';
const _config = require('../server/config')._config;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

exports.getRandomString = (length) => {
    let result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.encodeString = (secretkey) => {
    let splitSecretkey = secretkey.match(/.{1,3}/g);
    let encodedstring = '';
    splitSecretkey.forEach((str) => {
        if (str.length === 3) {
            encodedstring = encodedstring + str;
            let rndC = getRandomString(_config.internals.tokenrandomcharlength);
            encodedstring = encodedstring + rndC;
        } else {
            encodedstring = encodedstring + str;
        }
    })
    return encodedstring;
}

exports.decodeString = (encodedString) => {
    let splitSecretkey = encodedString.match(/.{1,3}/g);
    let decodedString = '';
    let i;
    for (i = 0; i < splitSecretkey.length; i++) {
        if (i % 2 === 0) {
            decodedString = decodedString + splitSecretkey[i];
        }
    }
    return decodedString;
}

exports.generateToken = (user) => {
    let today = new Date().toJSON().split('T');
    var env = process.env.NODE_ENV || 'development';
    let encryptedCode = encodeString(user);
    const Token = jwt.sign({
        username: encryptedCode.toString(),
        platform: env.toString(),
        date: today[0] // only date
    }, _config.internals.projectsecretkey, {
        expiresIn: 86400 // expires in 24 hours
    });
    let encryptedToken = dataencryption.encryptedString(Token);
    return {
        username: user.username,
        token: encryptedToken,
        currentdate: new Date(),
    };
}

exports.dataencryption = {
    encryptedString: (req) => {
        let encryptPwd;
        var cipher = crypto.createCipher('aes-256-cbc', _config.internals.tokenencodetkey);
        encryptPwd = cipher.update(req, 'utf-8', 'hex');
        encryptPwd += cipher.final('hex');
        return encryptPwd;
    },
    decryptedString: (req) => {
        let decryptedPwd;
        var decipher = crypto.createDecipher('aes-256-cbc', _config.internals.tokenencodetkey);
        decryptedPwd = decipher.update(req, 'hex', 'utf-8');
        decryptedPwd += decipher.final('utf-8');
        return decryptedPwd;
    }
};