const express = require('express');

const user = require('./userrouter');

const router = express.Router();

router.use('/user', user);

module.exports = router;