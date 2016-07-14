
var flightSearch = {
    baseUrl : 'http://localhost:3000/search',
    doSearch : function() {
        var date = $('#txt-date').val();
        var from = $('#txt-from').val();
        var to = $('#txt-to').val();
        flightSearch.hideResults();
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
                            row += '<td>' + new Date(flight.start.dateTime).toLocaleTimeString() + '</td>';
                            row += '<td>' + flight.finish.airportName + '</td>';
                            row += '<td>' + new Date(flight.finish.dateTime).toLocaleTimeString() + '</td>';
                            row += '<td>' + flight.durationMin + ' mins </td>';
                            row += '<td>' + flight.price + '</td>';
                            row += '</tr>';
                            content += row;
                        });
                        $(flightTable).html(content);
                    });
                    $('#search-results').show();
                },
                error: function (xhr, options, err) {
                    alert('An error occured. Please try again later.')
                }
            });

        }
        else {
            // Display error message
        }

    },
    validate: function(date, from, to){
        var iso = '^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$';
        if((date && from && to) && from.length > 2 && to.length > 2){
            if(date.match(iso)){
                return true;
            }
            alert("Invalid date!");
            return false;
        }
        alert('All fields are required. Date must be in the format YYYY-MM-DD!');
        return false;
    },
    buildUrl : function (date, from, to) {
        return flightSearch.baseUrl + '?date=' + date +'&from=' + from + '&to=' + to;
    },
    hideResults : function () {
        $('#search-results').hide();
    }
}
