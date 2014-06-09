/*jslint node: true */
"use strict";

var _DomainConfig = require("./DomainConfig.json").node;
var express = require("express");
var http = require("http");

var _commands = _DomainConfig.commands;
var DOMAIN_ID = _DomainConfig.DOMAIN_ID;

var app = null;
var domainManager = null;
var server = null;

var nextTick = process.nextTick;

// Keep track of all connected sockets
var _connectedSockets = [];

// Keeps track of all connected sockets
// and closes them if needed
function _handleConnection(socket) {
    _connectedSockets.push(socket);
    socket.on('close', function _onSocketClose() {
        _connectedSockets.splice(_connectedSockets.indexOf(socket), 1);
    });
}

function closeServer(done) {
    if (!server) {
        nextTick(done.bind(null, null));
    }

    // In order to shutdown a HTTP server,
    // one has to destroy all connected sockets manually
    _connectedSockets.forEach(function _iterate(socket) {
        socket.destroy();
    });

    server.close(function callback(err) {
        if (err) {
            return done(err);
        }

        app = null;
        server = null;
        done(null);
    });
}

function launchServer(options, done) {
    var basepath = options.basepath;

    app = express()
        .use(require("serve-static")(basepath))
        .use(require("serve-index")(basepath));

    if (!server) {
        server = http.createServer(app);
    }

    server
        .on("connection", _handleConnection)
        .listen(options.port, done);
}

exports.init = function init(manager) {
    domainManager = manager;

    if (!manager.hasDomain(DOMAIN_ID)) {
        manager.registerDomain(DOMAIN_ID, { major: 0, minor: 1 });
    }

    manager.registerCommand(
        DOMAIN_ID,
        _commands.SERVER_CLOSE,
        closeServer,
        true
    );

    manager.registerCommand(
        DOMAIN_ID,
        _commands.SERVER_LAUNCH,
        launchServer,
        true
    );
};
