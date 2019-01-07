var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Alpaca = require('@alpacahq/alpaca-trade-api')
var request = require('request-promise');

// const x = require('../algo/retro_tester')
const api_toucher = require('../algo/api_toucher')
const retro_tester = require('../algo/retro_tester')
// const sync_tester = require('../algo/sync_tester')
const Example = require('../algo/algorithm');

router.get('/', function (req, res, next) {

  const alpaca = new Alpaca({
    keyId: process.env.ALPACA_PAPER_KEY,
    secretKey: process.env.ALPACA_PAPER_SECRET,
    paper: true
  })

  alpaca.getAccount().then((account) => {

    res.status(200).json({
      message: 'success',
      obj: account
    });
  })


});

router.get('/polygon', function (req, res, next) {

  api_toucher.polygon_historical_data('BCRX').then((result) => {
    res.status(200).json({
      message: 'success',
      obj: result["ticks"]
    });
  })

});

router.get('/symbols', function (req, res, next) {

  api_toucher.polygon_all_symbols(3).then((result) => {
    res.status(200).json({
      message: 'success',
      obj: result
    });
  })

});

router.get('/save-api-data', function(req, res, next) {
  api_toucher.saveApiData().then((result) => {
    res.status(200).json({
      message: 'success',
      obj: result
    });
  })
})

router.get('/promise', function (req, res, next) {
  api_toucher.promise.then((result) => {
    res.status(200).json({
      message: 'success',
      obj: result
    });
  });
})

// router.get('/sync-promise', function (req, res, next) {
//   sync_tester.consecutive_async_wrapped_in_promise.then((result) => {
//     res.status(200).json({
//       message: 'success',
//       obj: result
//     });
//   });
// })

router.get('/retro', function (req, res, next) {
  retro_tester.fullRetroTest().then((result) => {
    res.status(200).json({
      message: 'success',
      obj: result
    });
  });
})

module.exports = router;
