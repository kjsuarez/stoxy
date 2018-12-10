var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.get('/', function (req, res, next) {
  res.status(200).json({
    message: 'success',
    obj: ["this is a testestestest"]
  });
});

module.exports = router;
