var request = require('request-promise');
var express = require('express');

function polygon_historical_data(){
console.log(process.env.ALPACA_PAPER_KEY);
  var options = {
    uri: 'https://api.polygon.io/v1/historic/agg/day/AAPL',
    qs: {
        from: '4-1-2018',
        to: '4-5-2018',
        apiKey: process.env.ALPACA_PAPER_KEY
    },
    json: true // Automatically parses the JSON string in the response
  };

  return request(options)
}

module.exports = {
  polygon_historical_data: polygon_historical_data
};
