var request = require('request-promise');
var rex = require('request');
var express = require('express');
var async = require('async');
const fs = require('fs');

const api_toucher = require('./api_toucher')

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

function getYearsOfData(symbol = 'AAPL', years_of_data = years_of_data) {
  const x = api_toucher.polygon_historical_data(symbol, years_of_data)
  return x
}

// var promise = new Promise(function(resolve, reject) {
//   polygon_all_symbols().then((symbol_hash) => {
//     console.log(symbol_hash["symbols"].length);
//     polygon_historical_data().then((hist_data) => {
//       resolve(hist_data);
//     })
//
//   })
// });


// var consecutive_async_wrapped_in_promise = new Promise(function(resolve, reject) {
//   fs.readFile("symbols.txt", (err, data) => {
//     if (err) {
//       // pull symbol data from api and proceed
//       polygon_all_symbols(10000).then((all_stocks) => {
//         fs.writeFile("symbols.txt", JSON.stringify(all_stocks), function(err) {
//           if(err) {
//               return console.log(err);
//           }
//
//           console.log("The file was saved!");
//         });
//
//         const response_data = {"passes": 0, "fails": 0}
//         all_stocks = all_stocks["symbols"];
//
//         async.eachOfSeries(all_stocks,
//         function(symbol_data, index, callback) {
//           stock = symbol_data["symbol"];
//
//           getYearsOfData(stock, 2).then((stock_history, z = index) => {
//             console.log(z + " : " + stock_history["ticks"].length);
//             if (stock_history["ticks"].length > 500) {
//               response_data["passes"] +=1
//             }else{
//               response_data["fails"] +=1
//             }
//
//             callback();
//
//           })
//
//         }, function(err) {
//           if (err) console.error(err.message);
//           console.log('done')
//         });
//
//         resolve(response_data);
//       })
//     } else {
//       const all_stocks = JSON.parse(data)
//       const response_data = {"passes": 0, "fails": 0}
//       all_stocks = all_stocks["symbols"];
//
//       async.eachOfSeries(all_stocks,
//       function(symbol_data, index, callback) {
//         stock = symbol_data["symbol"];
//
//         getYearsOfData(stock, 2).then((stock_history, z = index) => {
//           console.log("me");
//           console.log(z + " : " + stock_history["ticks"].length);
//           if (stock_history["ticks"].length > 500) {
//             response_data["passes"] +=1
//           }else{
//             response_data["fails"] +=1
//           }
//
//           callback();
//
//         })
//
//       }, function(err) {
//         if (err) console.error(err.message);
//         console.log('done')
//       });
//     }
//   });
//
// });


module.exports = {
  polygon_historical_data: polygon_historical_data,
  polygon_all_symbols: polygon_all_symbols//,
  // consecutive_async_wrapped_in_promise: consecutive_async_wrapped_in_promise
};
