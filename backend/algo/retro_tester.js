var lsq = require('least-squares')
const api_toucher = require('./api_toucher')
const fs = require('fs');
const readline = require('readline');

const years_of_data = 4

//initialize algo
const minimum_percent_down_to_buy = -5
const maximum_percent_down_to_buy = -10
const percent_up_to_sell = 2
const year_slope_ceiling = 0.046
const year_slope_floor = 0.02
const month_slope_ceilng = 0.046
const month_slope_floor = -0.5
const check_volatility = false
const radical_period = 15
const radical_tolerance = 0.3
const years_till_mature = 1

function fullRetroTest(){
  return new Promise(function(resolve, reject) {

    // init retro-tester variables
    const years_of_data = 4
    const total_output = {"total days": 0, "buys": 0, "no_buy_days": 0}
    const results = []
    const daily_stats = []

    const rl = readline.createInterface({
      input: fs.createReadStream("history_data.txt"),
      crlfDelay: Infinity
    });

    // for each line of history file (where a line represents up to 5 years of historical day data)
    rl.on('line', (line) => {
      hist_data = JSON.parse(line)

      //check that stock is mature enough run through algo
      if (isMature(hist_data)) {

        // starting x days into hist_data, loop through hist_data
        // where x is an algo var
        for (var day_in_hist = earliestBuyDate(); day_in_hist < hist_data["ticks"].length; day_in_hist++) {

          // console.log("day " + day_in_hist + " of "+ hist_data["ticks"].length);

          total_output["total days"] +=1;

          if (todayPassesAlgorithm(hist_data["ticks"], day_in_hist)) {
            // make note of purchase
            results.push("made a purchase")
            total_output["buys"] +=1;
            //console.log( hist_data["ticks"].length + " days of history for " + hist_data["symbol"]);

            // loop through hist_data from this day in time to
            // end of data looking for when sell would be made
          }else{
            results.push("did not make a purchase")
            total_output["no_buy_days"] +=1

          }

        }
        console.log( `${hist_data["ticks"].length} days of history for ${hist_data["symbol"]}. output: ${JSON.stringify(total_output)}`);
      }

    });

    rl.on('close', (summery) => {
      resolve(total_output);
    })

  });
}

function earliestBuyDate() {
  return (251 * years_till_mature)
}

function isMature(history) {
  // console.log("days of data pulled:");
  // console.log(history["ticks"].length + "vs" + (251 * years_till_mature));
  return history["ticks"].length > (251 * years_till_mature)
}

function getAllSymbols(size) {
  return api_toucher.polygon_all_symbols(size)
}

function getYearsOfData(symbol = 'AAPL', years_of_data = years_of_data) {
  const x = api_toucher.polygon_historical_data(symbol, years_of_data)
  return x
}

function todayPassesAlgorithm(history, day_in_hist) {
  // define some variables
  today = history[day_in_hist]
  yesterday = history[day_in_hist-1]
  day_change = today["c"] - yesterday["c"]
  percent_change = (day_change / yesterday["c"])*100

  if (percent_change < minimum_percent_down_to_buy &&
     percent_change > maximum_percent_down_to_buy) {

    // define more variables
    year_slope = x_days_slope(history, day_in_hist, 251, years_of_data)
    month_slope = x_days_slope(history, day_in_hist, 30, years_of_data)
    week_slope = x_days_slope(history, day_in_hist, 10, years_of_data)

    last_year_of_data_from_this_point_in_history = history.slice(day_in_hist - 251, day_in_hist)

    // check for erratic nature
    // we never wrote the erratic function -_-
    if (check_volatility) {
      is_low_volatility = !erratic(last_year_of_data_from_this_point_in_history, radical_period, radical_tolerance)
    } else {
      is_low_volatility = true
    }

    // if algo requirements are met
    if (year_slope > year_slope_floor && year_slope < year_slope_ceiling){ //&& month_slope < month_slope_ceilng && month_slope > month_slope_floor && is_low_volatility) {
      console.log("will buy")
      // this.total_output["buys"] += 1;
      return true

    } else {
      // console.log("wont buy because of year or month slope")
      // console.log("year slope: " + year_slope + "month slope:" + month_slope)
      // this.total_output["no_buy_days"] += 1
      return false
    }
  }else{
    // console.log("wont buy because % day change wrong: " + percent_change);
    // this.total_output["no_buy_days"] += 1
    return false
  }
}

function x_days_slope(history, index, days, year_of_data) {
  x = []; y = [];
  start = history.length / years_of_data;
  for (var i = 0; i < days.length; i++) {
    x[i] = i; y[i] = history[index + start - (days-i)]["o"]
  }
  var ret = {}
  var f = lsq(x, y, ret)

  return ret["m"]
}

module.exports = {
  fullRetroTest: fullRetroTest
};
