/* jshint node: true, strict: true */

"use strict";


const   EventEmitter    = require('events').EventEmitter,
        express         = require('express'),

        parameters      = require('./parameters.js'),

        hbs             = require('hbs'),
        util            = require('util'),
        path            = require('path');






var Router = module.exports = function (config) {
    var self = this;
    this.router = express();



    // Validate route parameters

    this.router.param('tag', parameters.tag);



    // Set up template engine

    hbs.registerPartials(path.resolve(__dirname, '../views/partials/'));
    // this.router.set('Content-Type', 'image/svg+xml');
    this.router.set('view engine', 'hbs');
    this.router.set('views', path.resolve(__dirname, '../views/'));


    this.router.get('/svg/:tag', function (req, res, next) {
        // res.writeHead(200, {'Content-Type' : 'image/svg+xml'});
        // res.set('Content-Type', 'image/svg+xml');
        res.render('component', {
            tag: req.params.tag
        });
    });

};
util.inherits(Router, EventEmitter);
