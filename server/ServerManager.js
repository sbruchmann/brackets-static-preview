/*globals $, brackets, define*/
define(function (require, exports, module) {
    "use strict";

    var _              = brackets.getModule("thirdparty/lodash"),
        _DomainConfig  = require("text!server/DomainConfig.json"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain     = brackets.getModule("utils/NodeDomain"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        ProjectManager = brackets.getModule("project/ProjectManager");

    _DomainConfig = JSON.parse(_DomainConfig);

    var _commands = _DomainConfig.commands;

    var _prefs = PreferencesManager.getExtensionPrefs("sbruchmann.staticpreview");

    var _STATES = {
        CRASHED: "CRASHED",
        IDLE: "IDLE",
        LAUNCHING: "IDLE",
        RUNNING: "RUNNING"
    };

    var _currentState = _STATES.IDLE;

    var domain = new NodeDomain(
        _DomainConfig.id,
        ExtensionUtils.getModulePath(module, "ServerDomain.js")
    );

    function _setState(state) {
        var prev = _currentState;

        if (prev !== state) {
            _currentState = state;
            $(module.exports).triggerHandler("stateChange", _currentState);
        }
    }

    function getCurrentState() {
        return _currentState;
    }

    function getDefaultConfig() {
        return _.cloneDeep(_DomainConfig.defaults);
    }

    /**
     * @TODO What should happen if the server was not closed?
     */
    function closeServer() {
        var deferred = new $.Deferred();

        domain.exec(_commands.CLOSE)
            .fail(function (err) {
                _setState(_STATES.CRASHED);
                deferred.reject(err);
            })
            .then(function _callback() {
                _setState(_STATES.IDLE);
                deferred.resolve.apply(deferred, arguments);
            });

        return deferred.promise();
    }

    function launchServer() {
        var deferred = new $.Deferred();
        var options = {
            basepath: ProjectManager.getProjectRoot().fullPath,
            hostname: _prefs.get("hostname"),
            port: _prefs.get("port")
        };

        _setState(_STATES.LAUNCHING);
        domain.exec(_commands.LAUNCH, options)
            .fail(deferred.reject.bind(deferred))
            .then(function _callback() {
                _setState(_STATES.RUNNING);
                deferred.resolve.apply(deferred, arguments);
            });

        return deferred.promise();
    }

    // Public API
    exports.getCurrentState = getCurrentState;
    exports.getDefaultConfig = getDefaultConfig;
    exports.closeServer = closeServer;
    exports.launchServer = launchServer;
});
