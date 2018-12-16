var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Alpaca = require('@alpacahq/alpaca-trade-api')
var request = require('request-promise');

const hist_data = require('../algo/retro_tester')
//

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

  hist_data.polygon_historical_data().then((result) => {
    res.status(200).json({
      message: 'success',
      obj: result
    });
  })

});

module.exports = router;
