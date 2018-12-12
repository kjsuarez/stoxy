var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Alpaca = require('@alpacahq/alpaca-trade-api')
var request = require('request-promise');
//

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

  var options = {
    uri: 'https://api.polygon.io/v1/historic/agg/day/AAPL',
    qs: {
        from: '4-1-2017',
        to: '4-1-2018',
        apiKey: process.env.ALPACA_PAPER_KEY
    },
    json: true // Automatically parses the JSON string in the response
};

request(options)
  .then((result) => {
    console.log('result:', result)
    res.status(200).json({
      message: 'success',
      obj: result
    });
  })
  .catch(function (err) {
      // API call failed...
  });

});

module.exports = router;
