const express = require('express');

const carmaster = require('../controllers/carmaster');
const validator = require('../../utils/validator');
const authuser = require('../../api/middlewares/authuser');
const schema = require('../../utils/schema/carmasterschema');
const carrouter = express.Router();

carrouter.post('/', authuser(), validator(schema.addcar), carmaster.addcar);
carrouter.get('/nearby', authuser(), validator(schema.nearbycabs), carmaster.getnearbycars);

module.exports = carrouter;