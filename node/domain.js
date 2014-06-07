/*jslint node: true */
"use strict";

var express = require("express");
var http = require("http");

var DOMAIN_ID = "sbruchmann.staticdev";

var app = express();
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

        server = null;
        done(null);
    });
}

function launchServer(options, done) {
    if (!server) {
        server = http.createServer(app);
    }

    app.use(require("serve-static")(options.basepath));

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
        "closeServer",
        closeServer,
        true
    );

    manager.registerCommand(
        DOMAIN_ID,
        "launchServer",
        launchServer,
        true
    );
};
