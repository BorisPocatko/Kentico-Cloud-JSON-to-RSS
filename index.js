// START - Require section 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var jwt = require('jwt-simple');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));
// END - Require section




// Application port
app.set('port', process.env.PORT || 5000);


// START - Setting up the HTTP server
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/', function(request, response) {
    var rssItems = [
        { title: 'Bloody Mary', link: "http://seethestreet.com", description: "", pubDate: "", mediaThumbnail: "" },
        { title: 'Bloody Mary2', link: "http://seethestreet.com", description: "", pubDate: "", mediaThumbnail: "" },
        { title: 'Bloody Mary3', link: "http://seethestreet.com", description: "", pubDate: "", mediaThumbnail: "" }
    ];
   
    response.render('pages/index', {
        rssItems: rssItems
    });
});



// END - Setting up the HTTP server

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});







