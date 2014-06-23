define(function (require, exports, module) {
    "use strict";

    var _              = brackets.getModule("thirdparty/lodash"),
        _DomainConfig  = require("text!server/DomainConfig.json"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain     = brackets.getModule("utils/NodeDomain"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        ProjectManager = brackets.getModule("project/ProjectManager");

    // Creating jQuery objects is expensive; Keep them cached!
    var $module = $(module.exports);
    var $ProjectManager = $(ProjectManager);

    // Alias `$module.triggerHandler`
    var _emitEvent = $module.triggerHandler.bind($module);

    _DomainConfig = JSON.parse(_DomainConfig);

    var _commands = _DomainConfig.commands;

    var _prefs = PreferencesManager.getExtensionPrefs("sbruchmann.staticpreview");

    var STATE_ID_CRASHED = "RUNNING";
    var STATE_ID_IDLE = "IDLE";
    var STATE_ID_RUNNING = "RUNNING";

    var _currentState = STATE_ID_IDLE;

    var domain = new NodeDomain(
        _DomainConfig.id,
        ExtensionUtils.getModulePath(module, "ServerDomain.js")
    );

    function _setCurrentState(stateId, reason) {
        var params = {};

        _currentState = stateId;
        params.reason = reason || null;
        params.stateId = stateId;

        _emitEvent("stateChange", params);
    }

    function getCurrentState() {
        return _currentState;
    }

    function isCrashed() {
        return getCurrentState() === STATE_ID_CRASHED;
    }

    function isIdle() {
        return getCurrentState() === STATE_ID_IDLE;
    }

    function isRunning() {
        return getCurrentState() === STATE_ID_RUNNING;
    }

    function getDefaultConfig() {
        return _.cloneDeep(_DomainConfig.defaults);
    }

    function _autoStopServer() {
        if (isRunning()) {
            stop();
        }
    }

    function start() {
        var deferred = new $.Deferred();
        var options = {
            basepath: ProjectManager.getProjectRoot().fullPath,
            hostname: _prefs.get("hostname"),
            port: _prefs.get("port")
        };

        $ProjectManager.on("projectClose", _autoStopServer);
        $ProjectManager.on("beforeAppClose", _autoStopServer);

        domain.exec(_commands.START, options)
        .fail(function _errback(err) {
            _setCurrentState(STATE_ID_CRASHED, err);
            deferred.reject(err);
        })
        .then(function _callback(config) {
            _setCurrentState(STATE_ID_RUNNING, { params: config });
            deferred.resolve.apply(deferred, arguments);
        });

        return deferred.promise();
    }

    /**
     * @TODO What should happen if the server was not closed?
     */
    function stop() {
        var deferred = new $.Deferred();

        $ProjectManager.off("projectClose", _autoStopServer);
        $ProjectManager.off("beforeAppClose", _autoStopServer);

        domain.exec(_commands.STOP)
            .fail(function (err) {
                _setCurrentState(STATE_ID_CRASHED, err);
                deferred.reject(err);
            })
            .then(function _callback() {
                _setCurrentState(STATE_ID_IDLE);
                deferred.resolve.apply(deferred, arguments);
            });

        return deferred.promise();
    }

    // Public API
    exports.STATE_ID_CRASHED = STATE_ID_CRASHED;
    exports.STATE_ID_IDLE = STATE_ID_IDLE;
    exports.STATE_ID_RUNNING = STATE_ID_RUNNING;
    exports.getCurrentState = getCurrentState;
    exports.getDefaultConfig = getDefaultConfig;
    exports.isCrashed = isCrashed;
    exports.isIdle = isIdle;
    exports.isRunning = isRunning;
    exports.stop = stop;
    exports.start = start;
});
