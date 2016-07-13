var request = require('request');

var BASE_URL = 'http://node.locomote.com/code-task/';

var FlightsApi = {
    getAllAirlines: function(callback) {
        // gets a list of airlines from the flights API
        callback(null, ['QF', 'ET', 'PanAm']);
    },

    getAirports: function(query, callback) {
        // gets a list of matching airports from the flights API
        callback(null, ['Bole', 'Mekelle', 'Gondar']);
    },

    searchFlights: function (isoDate, origin, destination, callback) {
        // searches for matching flights
        callback(null, ['F12', 'F32']);
    }

}



module.exports = FlightsApi;