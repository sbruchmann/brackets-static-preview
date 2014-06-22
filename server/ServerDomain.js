"use strict";

var _DomainConfig = require("./DomainConfig.json");
var HTTPServer = require("./HTTPServer");

var _commands = _DomainConfig.commands;
var DOMAIN_ID = _DomainConfig.id;

var domainManager = null;
var server = new HTTPServer();

function stop(done) {
    server.stop(done);
}

function start(options, done) {
    server.start(options, done);
}

exports.init = function init(manager) {
    domainManager = manager;

    if (!manager.hasDomain(DOMAIN_ID)) {
        manager.registerDomain(DOMAIN_ID, { major: 0, minor: 1 });
    }

    manager.registerCommand(DOMAIN_ID, _commands.STOP, stop, true);
    manager.registerCommand(DOMAIN_ID, _commands.START, start, true);
};
