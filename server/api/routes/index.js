const express = require('express');

const user = require('./userrouter');
const carmaster = require('./carrouter');

const router = express.Router();

router.use('/user', user);
router.use('/car', carmaster);

module.exports = router;