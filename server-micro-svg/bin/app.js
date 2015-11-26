/* jshint node: true, strict: true */

"use strict";

const   http            = require('http'),
        bole            = require('bole'),

        parameters      = require('./parameters.js'),
        config          = require('./config.js'),
        errors          = require('express-error-responses/lib/middleware.js'),
        routes          = require('./routes.js'),
        assets          = require('./assets.js'),

        express         = require('express'),
        compress        = require('compression')(),
        serveStatic     = require('serve-static'),

        Component       = require('../lib/main.js'),

        app             = express(),
        log             = bole('app');



// Configure logging

bole.output({
    level: config.get('logConsoleLevel'),
    stream: process.stdout
});



// Set up component that this server serves

const component = new Component();


// Set default view to svg

// app.set('view engine', 'svg');

// Configure application

app.disable('x-powered-by');
app.enable('trust proxy');
app.use(compress);



// Validate URL parameters

app.param('publication', parameters.publication);



// Serve server specific static files

app.use(config.get('publicPath') + '/:publication', serveStatic(config.get('docRoot'), { index: 'index.svg' }));



// Set up server specific routes

app.get(config.get('contextPath') + '/apiadmin/ping', routes.ping);
app.get(config.get('publicPath') + '/assets/main.js', assets.js);
app.get(config.get('publicPath') + '/assets/main.json', assets.json);



// Attach the component router

app.use(config.get('publicPath') + '/:publication', component.router);



// Error handling

app.use(errors.response);
app.use(errors.status404);



// Set up and export http server

const httpServer = module.exports = http.createServer(app);
