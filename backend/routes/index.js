var express = require('express');
var router = express.Router();
var locomote = require('./flightsApi');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Flight Search | Eyassu Getachew Bulfeta' });
});

router.get('/airlines', function (req, res, next) {

  locomote.getAllAirlines(function (error, data) {
    if(!error) {
      //var airlines = JSON.parse(data);
      res.end(JSON.stringify(data));
    }
    else res.status(500).end(error.toString());
  });
});

router.get('/airports', function (req, res, next) {
  var query = req.query.q;
  if(!query || query.length < 2)
    res.status(400).end('Please provide a valid query');

  locomote.getAirports(query, function(error, data) {
      if(!error) {
        //var airports = KSON.parse(data);
        res.end(JSON.stringify(data));
      }
      else res.status(500).end(error.toString());
  });
});

router.get('/search', function (req, res, next) {
    var date = req.query.date;
    var origin = req.query.from;
    var destination = req.query.to;
    //TODO: Add request validation
    if(!(date || origin || destination) || origin.length < 2 || destination.length < 2)
        res.status(400).end('Invalid request!');
    else if(!date.match('^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$'))
        res.status(400).end('Invalid date!');
    else {
        var parsedDate = new Date(Date.parse(date));
        locomote.searchFlights(parsedDate, origin, destination, function(error, data) {
            if(!error) {
                //var flights = JSON.parse(data);
                res.end(JSON.stringify(data));
            }
            else res.status(500).end(error.toString());
        });
    }
});

module.exports = router;
