//This module deals with account management
//It handles routing to the functions/modules that will handle editing user data
//The functions will be housed in here until the grow too big after which they get their own modules
const express = require('express');
const router = express.Router();

router.use('/', function (req, res, next) {
    res.send("<h1>Hello, this is the account handling module</h1>");
});
module.exports = router;