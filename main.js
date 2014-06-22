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

    function _handleServerStateChange($event, currentState) {
        CommandManager.get(CMD_STATIC_PREVIEW).setChecked(ServerManager.isRunning());
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
        if (!ServerManager.isRunning()) {
            ServerManager.start();
        } else {
            ServerManager.stop();
        }
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
