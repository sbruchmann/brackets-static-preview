"use strict";

/**
 * @const
 * @type {string}
 * @private
 */
var DOMAIN_ID = "sbruchmann.staticpreview.LocalServer";

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
    setTimeout(callback.bind(null, null));
}

function stop(callback) {
    setTimeout(callback.bind(null, null));
}

exports.init = init;
