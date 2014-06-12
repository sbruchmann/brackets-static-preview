/*globals $, brackets, define*/
define(function (require, exports, module) {
    "use strict";

    var _                  = brackets.getModule("thirdparty/lodash"),
        AppInit            = brackets.getModule("utils/AppInit"),
        CommandManager     = brackets.getModule("command/CommandManager"),
        Commands           = brackets.getModule("command/Commands"),
        ExtensionUtils     = brackets.getModule("utils/ExtensionUtils"),
        Menus              = brackets.getModule("command/Menus"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        ProjectManager     = brackets.getModule("project/ProjectManager"),
        ServerManager      = require("server/ServerManager");

    var prefs = null;

    var CMD_STATIC_PREVIEW = "sbruchmann.staticpreview";

    function _isServerRunning() {
        return ServerManager.getCurrentState() === "RUNNING";
    }

    function _closeServer() {
        var deferred = new $.Deferred();

        ServerManager.closeServer()
            .fail(deferred.reject.bind(deferred))
            .then(function _callback() {
                console.debug("[Static Preview] server closed.");
                deferred.resolve();
            });

        return deferred.promise();
    }

    function _handleProjectClose(event, directory) {
        if (_isServerRunning()) {
            _closeServer();
        }

        $(ProjectManager).off("projectClose", _handleProjectClose);
    }

    function _handleServerStateChange($event, currentState) {
        CommandManager.get(CMD_STATIC_PREVIEW).setChecked(currentState === "RUNNING");
    }

    function _launchServer() {
        var deferred = new $.Deferred();

        $(ProjectManager).on("projectClose", _handleProjectClose);

        ServerManager.launchServer()
            .fail(function _errback(err) {
                console.error("[Static Preview]", err);
                deferred.reject(err);
            })
            .then(function _callback(config) {
                console.debug("[Static Preview] Launched server.", config);
                deferred.resolve(config);
            });

        return deferred.promise();
    }

    function _setupPrefs() {
        var defaults = ServerManager.getDefaultConfig();

        prefs = PreferencesManager.getExtensionPrefs("sbruchmann.staticpreview");

        if (typeof prefs.get("port") !== "number") {
            prefs.definePreference("port", "number", defaults.port);
            prefs.set("port", defaults.port);
            prefs.save();
        }

        if (typeof prefs.get("hostname") !== "string") {
            prefs.definePreference("hostname", "string", defaults.hostname);
            prefs.set("hostname", defaults.hostname);
            prefs.save();
        }
    }

    function _toggleStaticPreview() {
        return _isServerRunning() ? _closeServer() : _launchServer();
    }

    function _onAppReady() {
        var FILE_MENU = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        _setupPrefs();
        CommandManager.register("Static Preview", CMD_STATIC_PREVIEW, _toggleStaticPreview);
        $(ServerManager).on("stateChange", _handleServerStateChange);
        FILE_MENU.addMenuItem(
            CMD_STATIC_PREVIEW,
            null,
            Menus.AFTER,
            Commands.FILE_LIVE_FILE_PREVIEW
        );
    }

    AppInit.appReady(_onAppReady);
});
