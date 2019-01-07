var request = require('request-promise');
var rex = require('request');
var express = require('express');
const fs = require('fs');
var async = require('async');
var counter = 0;

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
    polygon_historical_data().then((hist_data) => {
      resolve(hist_data);
    })
  })
});

function saveApiData(start_point = 9001, end_point = 10000) {
  return new Promise(function(resolve, reject) {
    polygon_all_symbols().then((all_stocks) => {

      const symbol_file = fs.createWriteStream("symbols.txt");

      symbol_file.write(JSON.stringify(all_stocks))

      symbol_file.end();

      all_stocks = all_stocks["symbols"];

      some_stocks = all_stocks.slice(start_point, end_point)



      async.eachOfSeries(some_stocks,
      function(symbol_data, index, callback) {
        stock = symbol_data["symbol"];
        console.log("counter: " + counter);
        if (index >= counter) {
          polygon_historical_data(stock, 5).then((stock_history, z = index) => {
            console.log(z + " : " + stock + " : " + stock_history["ticks"].length);

            const history_file = fs.createWriteStream("history_data.txt", {flags: 'a'});
            history_file.write(JSON.stringify(stock_history) + "\n");
            symbol_file.end();

            callback();

          })
          counter += 1
        }


      }, function(err) {
        if (err) console.error(err.message);
        console.log('done')
        resolve("data saved");
      });


    })
  });
}

module.exports = {
  polygon_historical_data: polygon_historical_data,
  polygon_all_symbols: polygon_all_symbols,
  promise: promise,
  saveApiData: saveApiData
};
