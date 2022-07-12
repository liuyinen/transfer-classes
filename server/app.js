var express = require('express'),
	http = require('http'),
	urlHelper = require('./router.js'),
	config = require("./config"),
	cookieParser = require('cookie-parser'),
	session = require('express-session');

var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

app.use(cookieParser('sessionId'));
app.use(session({
	secret: 'sessionId', //与cookieParser中的一致
	resave: true,
	saveUninitialized: false
}));

urlHelper.setRequestUrl(app);

http.createServer(app).listen(config.port, function() {
	console.log("Express server listening on port " + config.port);
});
