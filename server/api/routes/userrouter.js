const express = require('express');

const user = require('../controllers/user');
const validator = require('../../utils/validator');
// import { schema } from '../../utils/schema'

const userrouter = express.Router();

userrouter.post('/', user.createuser);
module.exports = userrouter;