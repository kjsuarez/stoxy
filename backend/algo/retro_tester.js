const api_toucher = require('./api_toucher')

const years_of_data = 5

function getAllSymbols(size) {
  api_toucher.polygon_all_symbols(size)
}

function retroTest(symbol = 'AAPL', years_of_data = years_of_data) {
  api_toucher.polygon_historical_data(symbol, years_of_data)
}


var fullRetroTest = new Promise(function(resolve, reject) {
  let result = [];


  //initialize algo
  // init retro-tester variables

  // pull available symbols from polygon into an array
  api_toucher.polygon_all_symbols(3).then((all_stocks) => {
    console.log("all stocks:");
    console.log(all_stocks["symbols"]);
    // loop through stock array
    for (let stock of all_stocks["symbols"]) {
      console.log("for symbol:");
      console.log(stock["symbol"]);
      api_toucher.polygon_historical_data(stock["symbol"], 1).then((history) => {// retroTest(symbol, 1).then((history) => {
        console.log("here I am")
        result.push(history)
      })
    }
    resolve(result);

      // pull x amount of historal data from polygon
      // where x is a retro_tester var

      // starting x days into hist_data, loop through hist_data
      // where where x is an algo var

        // run hist_data from this point in time through algo and
        // determine if a buy would occur

        // if purchase is made, loop through hist_data from
        // this day in time to end of data looking for when sell would be made

        // record buy, sell, etc
  });
});



module.exports = {
  fullRetroTest: fullRetroTest
};
