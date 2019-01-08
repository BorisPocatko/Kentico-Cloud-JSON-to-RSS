// START - Require section 
var express = require('express');
var app = express();
var xml = require('xml');
var bodyParser = require('body-parser');
var cloudLink = "https://deliver.kenticocloud.com";  
var type_prefix = "items?system.type=";

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

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
  
  var projectId = GetQueryString(request,"projectid");
  var itemSystemType = GetQueryString(request,"itemsystemtype");
  var titleField = GetQueryString(request,"title");
  var linkField = GetQueryString(request,"link");
  var linkFormat = GetQueryString(request,"linkformat");
  var descriptionField = GetQueryString(request,"description");
  var pubDateField = GetQueryString(request,"pubdate");
  var mediaContentField = GetQueryString(request,"mediathumbnail");
  var topN = GetQueryString(request,"topn");
  
  
  /*
  https://json-to-rss.herokuapp.com/?projectid=7564058a-b788-4b71-ac2a-070e19b02042&itemsystemtype=project&topn=20&title=metadata__title&link=codename&linkformat=http://seethestreet.com/index.html?id=*&layout=gallery&mediathumbnail=metadata__hero_image&pubdate=last_modified&description=metadata__description
  */
  
  //console.log('query string:' + GetQueryString(request,"system.type")); 
 
  
  $.getJSON( cloudLink + "/" + projectId + "/" + type_prefix + itemSystemType).done(function( data ) {
      
      
           var rssItems = [];
      
      
          $.each( data.items, function( i, item ) {
        
           rssItems.push({ title: item.elements[titleField].value, link: linkFormat.replace('*', item.system["codename"]), description: item.elements[descriptionField].value, pubDate: item.system.last_modified, mediaContent: item.elements[mediaContentField].value["0"].url });   
            
                      
          });
          
          response.set('Content-Type', 'text/xml');
          response.render('pages/index', {
                rssItems: rssItems
            });
          
        });
  
  
   
});



// END - Setting up the HTTP server

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// get query string
function GetQueryString(request, name) {
    
    return request.query[name];
}






