var request = require('request-promise');
var rex = require('request');
var express = require('express');

function polygon_historical_data(symbol = 'AAPL', years_of_data = 5){

  var options = {
    uri: 'https://api.polygon.io/v1/historic/agg/day/' + symbol,
    qs: {
        from: xYearsAgoString(5),
        to: todayString(),
        apiKey: process.env.ALPACA_PAPER_KEY
    },
    json: true // Automatically parses the JSON string in the response
  };

  return request(options)
}

function todayString() {
  today = new Date();
  return (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear()
}

function xYearsAgoString(x) {
  today = new Date();
  return (today.getMonth() + 1) + '-' + today.getDate() + '-' + (today.getFullYear() - x)
}

function polygon_all_symbols(size = 10000) {
  var options = {
    uri: 'https://api.polygon.io/v1/meta/symbols',
    qs: {
        apiKey: process.env.ALPACA_PAPER_KEY,
        perpage: size,
        type: 'cs'
    },
    json: true // Automatically parses the JSON string in the response
  };

  return request(options)
}

var promise = new Promise(function(resolve, reject) {
  polygon_all_symbols().then((symbol_hash) => {
    console.log(symbol_hash["symbols"].length);
    polygon_historical_data().then((hist_data) => {
      resolve(hist_data);
    })

  })
});

module.exports = {
  polygon_historical_data: polygon_historical_data,
  polygon_all_symbols: polygon_all_symbols,
  promise: promise
};
