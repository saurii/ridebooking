const express = require('express');

const user = require('../controllers/user');
const validator = require('../../utils/validator');
const schema = require('../../utils/schema/usermasterschema');
const userrouter = express.Router();

userrouter.post('/', validator(schema.createusermaster), user.createuser);
module.exports = userrouter;