const express = require('express');

const user = require('../controllers/user');
const validator = require('../../utils/validator');
const schema = require('../../utils/schema/usermasterschema');
const authuser = require('../../api/middlewares/authuser');
const userrouter = express.Router();

userrouter.post('/', validator(schema.createusermaster), user.createuser);
userrouter.post('/login', validator(schema.loginschema), user.login);
userrouter.get('/getridedetails', authuser(), validator(schema.ridedetails), user.getridedetails);

module.exports = userrouter;