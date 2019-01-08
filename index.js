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
  var linkFormat = Base64.decode(GetQueryString(request,"linkformat"));
  var descriptionField = GetQueryString(request,"description");
  var pubDateField = GetQueryString(request,"pubdate");
  var mediaContentField = GetQueryString(request,"mediathumbnail");
  var topN = GetQueryString(request,"topn");
  
  
  /*
  https://json-to-rss.herokuapp.com/?projectid=7564058a-b788-4b71-ac2a-070e19b02042&itemsystemtype=project&topn=20&title=metadata__title&link=codename&linkformat=http://seethestreet.com/index.html?id=*&layout=gallery&mediathumbnail=metadata__hero_image&pubdate=last_modified&description=metadata__description
  */
 
  
  if(projectId == null || projectId == 'undefined' || projectId =="")
  {
    response.render('pages/help');
  }
  
  $.getJSON( cloudLink + "/" + projectId + "/" + type_prefix + itemSystemType).done(function( data ) {
            
          var rssItems = [];      
      
          $.each( data.items, function( i, item ) {
            
            var titleValue = item.elements[titleField].value;
            var linkValue = linkFormat.replace('*', item.system["codename"]);
            var descriptionValue = item.elements[descriptionField].value;
            var pubDateValue = item.system.last_modified;
            var mediaContentValue = item.elements[mediaContentField].value["0"].url;
        
           rssItems.push({ 
              title: titleValue, 
              link: linkValue, 
              description: descriptionValue, 
              pubDate: pubDateValue, 
              mediaContent: mediaContentValue 
              });   
                    
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


/*
  *	Base64 encoding and decoding.
  */
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
 



