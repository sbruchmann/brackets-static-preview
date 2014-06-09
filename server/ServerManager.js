/*globals $, brackets, define*/
define(function (require, exports, module) {
    "use strict";

    var _              = brackets.getModule("thirdparty/lodash"),
        _DomainConfig  = require("text!server/DomainConfig.json"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain     = brackets.getModule("utils/NodeDomain");

    _DomainConfig = JSON.parse(_DomainConfig).node;

    var _defaults = {
        hostname: "0.0.0.0",
        port: 3000
    };

    var _isRunning = false;

    var domain = new NodeDomain(
        _DomainConfig.DOMAIN_ID,
        ExtensionUtils.getModulePath(module, "ServerDomain.js")
    );

    function getDefaultConfig() {
        return _.cloneDeep(_defaults);
    }

    /**
     * @TODO Improve state management
     */
    function isRunning() {
        return _isRunning;
    }

    /**
     * @TODO What should happen if the server was not closed?
     */
    function closeServer() {
        var deferred = new $.Deferred();

        domain.exec(_DomainConfig.commands.SERVER_CLOSE)
            .fail(deferred.reject.bind(deferred))
            .then(function _callback() {
                _isRunning = false;
                deferred.resolve.apply(deferred, arguments);
            });

        return deferred.promise();
    }

    function launchServer(options) {
        var deferred = new $.Deferred();

        domain.exec(_DomainConfig.commands.SERVER_LAUNCH, options)
            .fail(deferred.reject.bind(deferred))
            .then(function _callback() {
                _isRunning = true;
                deferred.resolve.apply(deferred, arguments);
            });

        return deferred.promise();
    }

    // Public API
    exports.getDefaultConfig = getDefaultConfig;
    exports.isRunning = isRunning;
    exports.closeServer = closeServer;
    exports.launchServer = launchServer;
});
