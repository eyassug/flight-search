var request = require('request');
var async = require('async');

var BASE_URL = 'http://node.locomote.com/code-task/';

var FlightsApi = {
    getAllAirlines: function(callback) {
        var airlinesUrl = BASE_URL + 'airlines';
        request(airlinesUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(null, JSON.parse(body));
            } else {
                if (error) {
                    callback(error);
                } else callback(body);
            }
        });
    },

    getAirports: function(query, callback) {
        var airportsUrl = BASE_URL + 'airports?q=' + query;

        request(airportsUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(null, JSON.parse(body));
            } else {
                if (error) {
                    callback(error);
                } else callback(body);
            }
        });
    },

    searchFlights: function (isoDate, origin, destination, callback) {
        SearchHelper.getRequestCombinations(isoDate,origin,destination, function (error, combinations) {
           if(!error) {

               // perform searches asynchronously (grouped by date)
               var dates = SearchHelper.getFiveDayRange(isoDate).map(function(date){return date.toISOString().slice(0,10);});
               var flightsByDate = dates.map(function (date) {
                   return function(handler) {
                       FlightsApi.getFlightsByDate(date, combinations, function (err, flightsByDate){
                           if(!err){
                               handler(null, flightsByDate);
                           }
                           else handler(err);
                       });
                   }
               });
               async.parallel(flightsByDate, function (err, flights) {
                   if(!err) {
                       callback(null, flights);
                   }
                   else callback(err);
               })

           } else callback(error)
        });
    },
    getFlightsByDate: function(date, combinations, callback){
        var flightSearches = combinations.map(function(combo) {
            return function(handler) {
                FlightsApi.doSearch(date, combo.airline, combo.origin, combo.destination, function(err, flights) {
                    if(!err) {
                        handler(null, flights);
                    }
                    else handler(err);
                });
            }
        });
        // run searches asynchronously
        async.parallel(flightSearches, function(err, flights) {
            if(!err) {
                // Flatten array
                var searchResults = [].concat.apply([], flights);
                callback(null, {
                    date: date,
                    flights: searchResults
                });
            }
            else callback(err);
        });
    },
    doSearch: function(isoDate, airlineCode, originAirport, destinationAirport, callback) {
        var searchUrl = BASE_URL + 'flight_search';// + airlineCode;
        var searchUrl = BASE_URL + 'flight_search/' + airlineCode;
        searchUrl += '?date=' + isoDate + '&from=' + originAirport + '&to=' + destinationAirport;
        request(searchUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var flights = JSON.parse(body);
                callback(null, flights);
            } else {
                if (error) {
                    callback(error);
                } else callback(body);
            }
        });
    }

}

var SearchHelper = {
    getRequestCombinations : function(isoDate, origin, destination, callback) {

        FlightsApi.getAllAirlines(function (error, allAirlines) {
            if(!error) {
                FlightsApi.getAirports(origin, function(error2, originAirports){
                    if(!error2) {
                        FlightsApi.getAirports(destination, function(error3, destinationAirports) {
                            if(!error3) {
                                var airlineCodes = allAirlines.map(function(airline) { return airline.code;});
                                var originAirportCodes = originAirports.map(function(airport) {return airport.airportCode;});
                                var destinationAirportCodes = destinationAirports.map(function(airport) {return airport.airportCode;});
                                var requestCombinations = SearchHelper.getCartasianProduct(airlineCodes, originAirportCodes, destinationAirportCodes);
                                callback(null, requestCombinations);
                            }
                            else callback(error3);
                        });
                    } else callback(error2);
                });
            }
            else callback(error);
        })
    },
    getFiveDayRange: function(isoDate) {
        // construct five-day range
        var fiveDayRange = [];
        var selectedDate = new Date(isoDate);
        for(var i=-2; i<=2; i++) {
            var date = new Date(selectedDate);
            date.setDate(selectedDate.getDate() + i);
            fiveDayRange.push(date);
        }
        return fiveDayRange;
    },
    getCartasianProduct: function(airlines, originAirports, destinationAirports) {
        var cartasian = [];
        airlines.forEach(function(airline) {
            originAirports.forEach(function(origin){
                destinationAirports.forEach(function(destination) {
                    var params = {airline : airline, origin : origin, destination : destination};
                    cartasian.push(params);
                });
            });
        });
        return cartasian;
    }

}



module.exports = FlightsApi;