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
        ServerManager      = require("server/ServerManager"),
        sharedProperties   = require("text!shared-properties.json");

    // TODO Add error handling
    try {
        sharedProperties = JSON.parse(sharedProperties);
    } catch (err) {}

    var prefs = null;

    var DOMAIN_ID = sharedProperties.node.DOMAIN_ID;
    var DOMAIN_PATH = ExtensionUtils.getModulePath(module, "node/domain.js");

    var _nodeCommands = sharedProperties.node.commands;

    var CMD_STATIC_PREVIEW = "sbruchmann.staticpreview";

    function _closeServer() {
        var command = CommandManager.get(CMD_STATIC_PREVIEW);
        var deferred = new $.Deferred();

        ServerManager.closeServer()
            .fail(deferred.reject.bind(deferred))
            .then(function _callback() {
                console.debug("[Static Preview] server closed.");
                command.setChecked(false);
                deferred.resolve();
            });

        return deferred.promise();
    }

    function _handleProjectClose(event, directory) {
        if (ServerManager.isRunning()) {
            _closeServer();
        }

        $(ProjectManager).off("projectClose", _handleProjectClose);
    }

    function _launchServer() {
        var command = CommandManager.get(CMD_STATIC_PREVIEW);
        var config = {
            basepath: ProjectManager.getProjectRoot().fullPath,
            hostname: prefs.get("hostname"),
            port: prefs.get("port")
        };
        var deferred = new $.Deferred();

        $(ProjectManager).on("projectClose", _handleProjectClose);

        ServerManager.launchServer(config)
            .fail(function _errback(err) {
                console.error("[Static Preview]", err);
                deferred.reject(err);
            })
            .then(function _callback() {
                console.debug("[Static Preview] Launched server.", config);
                command.setChecked(true);
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
        return ServerManager.isRunning() ? _closeServer() : _launchServer();
    }

    function _onAppReady() {
        var FILE_MENU = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        _setupPrefs();
        CommandManager.register("Static Preview", CMD_STATIC_PREVIEW, _toggleStaticPreview);
        FILE_MENU.addMenuItem(
            CMD_STATIC_PREVIEW,
            null,
            Menus.AFTER,
            Commands.FILE_LIVE_FILE_PREVIEW
        );
    }

    AppInit.appReady(_onAppReady);
});
