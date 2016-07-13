var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/airlines', function (req, res, next) {
  res.end('Lists available airlines from the Flight API.');
});

router.get('/airports', function (req, res, next) {
  res.end('Lists all matching airports from the Flight API.');
});

router.get('/search', function (req, res, next) {
  res.end('Searches for and lists all matching flights from the Flight API');
});

module.exports = router;
