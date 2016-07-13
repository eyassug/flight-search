var request = require('request');

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
        // searches for matching flights
        callback(null, ['F12', 'F32']);
    }

}



module.exports = FlightsApi;