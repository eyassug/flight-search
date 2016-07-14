
var flightSearch = {
    baseUrl : 'http://localhost:3000/search',
    doSearch : function() {
        var date = $('#txt-date').val();
        var from = $('#txt-from').val();
        var to = $('#txt-to').val();
        flightSearch.getFlights(date, from, to);
    },
    getFlights: function(date, from, to){
        if(flightSearch.validate(date, from, to)) {
            var url = flightSearch.buildUrl(date, from, to);
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    $.each(data, function(index, dateFlights){
                        $('ul#dates-list li').eq(index).find('a').text(dateFlights.date);
                        var flightTable = $('#day'+ index + ' table tbody');
                        var content = '';
                        $.each(dateFlights.flights, function(flightIndex, flight){
                            var row = '<tr>';
                            row += '<td>' + flight.airline.name + '</td>';
                            row += '<td>' + flight.flightNum + '</td>';
                            row += '<td>' + flight.start.airportName + ', ' + flight.start.cityName + ', ' + flight.start.countryName + '</td>';
                            row += '<td>' + new Date(flight.start.dateTime).toTimeString() + '</td>';
                            row += '<td>' + flight.finish.airportName + '</td>';
                            row += '<td>' + new Date(flight.finish.dateTime).toTimeString() + '</td>';
                            row += '<td>' + flight.durationMin + ' mins </td>';
                            row += '<td>' + flight.price + '</td>';
                            row += '</tr>';
                            content += row;
                        });
                        $(flightTable).html(content);
                    });
                    
                },
                error: function (err) {
                    // Display error message
                }
            });
        }
        else {
            // Display error message
        }

    },
    validate: function(date, from, to){
        //TODO:Add validation here
        return true;
    },
    buildUrl : function (date, from, to) {
        return flightSearch.baseUrl + '?date=' + date +'&from=' + from + '&to=' + to;
    },

    clearResults : function() {

    },
    hideResults : function () {
        $('#search-results').hide();
    }
}
