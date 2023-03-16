// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api", function(req, res) {
  res.json({
    'unix': Math.floor(new Date().getTime()),
    'utc': new Date().toUTCString(),
  });
});


/** Code init **/

function isValidDate(date) {

  // Date format: YYYY-MM-DD
  var datePattern = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

  // Check if the date string format is a match
  var matchArray = date.match(datePattern);
  if (matchArray == null) {
    return false;
  }

  // Remove any non digit characters
  var dateString = date.replace(/\D/g, '');

  // Parse integer values from the date string
  var year = parseInt(dateString.substr(0, 4));
  var month = parseInt(dateString.substr(4, 2));
  var day = parseInt(dateString.substr(6, 2));

  // Define the number of days per month
  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    daysInMonth[1] = 29;
  }

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    return false;
  }
  return true;
}

//load some assets
app.use("/public", express.static(__dirname + "/public"));

app.get("/api/:date", function(req, res) {
  //console.log('date: ', req.params.date);
  var reqDate;

  // handle date format like unixtimestamp "1451001600000"
  if (!isNaN(req.params.date)) {
    reqDate = new Date(parseInt(req.params.date));
    res.json({
      'unix': Math.floor(reqDate.getTime()),
      'utc': reqDate.toUTCString(),
    });
  } else {
    // handle date format with iphens "2015-12-25"
    if (isValidDate(req.params.date)) {
      reqDate = new Date(req.params.date);
      res.json({
        'unix': Math.floor(reqDate.getTime()),
        'utc': reqDate.toUTCString(),
      });
    } else {
      // check the pattern "05 October 2011, GMT"
      if(isNaN(Date.parse(req.params.date))){
        // if is not a valid date then throw error message
        res.json({ error: "Invalid Date" });
      } else {
        // handle the unsusual pattern "05 October 2011, GMT"
        reqDate = new Date(req.params.date);
        res.json({
          'unix': Math.floor(reqDate.getTime()),
          'utc': reqDate.toUTCString(),
        });
      }
    }
  }

});


/**  */

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
