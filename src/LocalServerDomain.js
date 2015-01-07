"use strict";

var HTTPServer = require("./HTTPServer");

/**
 * @const
 * @type {string}
 * @private
 */
var DOMAIN_ID = "sbruchmann.staticpreview.LocalServer";

/**
 * @type {HTTPServer}
 * @private
 */
var server = null;

function init(domainManager) {
    if (!domainManager.hasDomain(DOMAIN_ID)) {
        domainManager.registerDomain(DOMAIN_ID, {
            major: 1,
            minor: 0
        });
    }

    domainManager.registerCommand(DOMAIN_ID, "start", start, true);
    domainManager.registerCommand(DOMAIN_ID, "stop", stop, true);
}

function start(callback) {
    server = new HTTPServer();
    server.listen(callback);
}

function stop(callback) {
    server.close(callback);
}

exports.init = init;
