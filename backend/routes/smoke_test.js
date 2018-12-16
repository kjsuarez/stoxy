var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Alpaca = require('@alpacahq/alpaca-trade-api')
var request = require('request-promise');

// const x = require('../algo/retro_tester')
const api_toucher = require('../algo/api_toucher')

console.log(process.env.ALPACA_PAPER_KEY)

router.get('/', function (req, res, next) {

  const alpaca = new Alpaca({
    keyId: process.env.ALPACA_PAPER_KEY,
    secretKey: process.env.ALPACA_PAPER_SECRET,
    paper: true
  })

  alpaca.getAccount().then((account) => {
    console.log('Current Account:', account)

    res.status(200).json({
      message: 'success',
      obj: account
    });
  })


});

router.get('/polygon', function (req, res, next) {

  api_toucher.polygon_historical_data().then((result) => {
    res.status(200).json({
      message: 'success',
      obj: result
    });
  })

});

router.get('/symbols', function (req, res, next) {

  api_toucher.polygon_all_symbols().then((result) => {
    console.log(result["symbols"].length);
    res.status(200).json({
      message: 'success',
      obj: result
    });
  })

});

module.exports = router;
