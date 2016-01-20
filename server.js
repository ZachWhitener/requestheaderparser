'use strict';

var express = require('express');
//var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var useragent = require('express-useragent'); 

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(useragent.express()); 

app.route('/')
	.get(function(req, res){
		var ip = req.ip;
		var lang = req.get("Accept-Language").split(',')[0]; 
		var opsys = req.useragent.os; 
		console.log(opsys);
		
		var sendObj = {
			"ip": ip, 
			"Language": lang,
			"OS": opsys
		}; 
		
		res.send(JSON.stringify(sendObj)); 
	});

app.use(passport.initialize());
app.use(passport.session());

//routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});