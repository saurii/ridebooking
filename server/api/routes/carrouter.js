const express = require('express');

const carmaster = require('../controllers/carmaster');
const validator = require('../../utils/validator');
const authuser = require('../../api/middlewares/authuser');
const schema = require('../../utils/schema/carmasterschema');
const carrouter = express.Router();

carrouter.post('/', authuser(), validator(schema.addcar), carmaster.addcar);
carrouter.get('/nearby', authuser(), validator(schema.nearbycabs), carmaster.getnearbycars);
carrouter.post('/book', authuser(), validator(schema.bookcab), carmaster.bookcar);
carrouter.put('/updateride', authuser(), validator(schema.updateridedetails), carmaster.updateridedetails);
module.exports = carrouter;