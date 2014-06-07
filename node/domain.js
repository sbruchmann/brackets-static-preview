/*jslint node: true */
"use strict";

var http = require("http");

var DOMAIN_ID = "sbruchmann.staticdev";

var domainManager = null;
var server = null;

function _handleRequest(req, res) {
    res.end("Hello world\n");
}

function launchServer(options, done) {
    if (!server) {
        server = http.createServer();
    }

    server.on("request", _handleRequest);
    server.listen(options.port, done);
}

exports.init = function init(manager) {
    domainManager = manager;

    if (!manager.hasDomain(DOMAIN_ID)) {
        manager.registerDomain(DOMAIN_ID, { major: 0, minor: 1 });
    }

    manager.registerCommand(
        DOMAIN_ID,
        "launchServer",
        launchServer,
        true
    );
};
