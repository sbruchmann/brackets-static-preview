define(function (require) {
    "use strict";

    var AppInit            = brackets.getModule("utils/AppInit"),
        CommandManager     = brackets.getModule("command/CommandManager"),
        Commands           = brackets.getModule("command/Commands"),
        Menus              = brackets.getModule("command/Menus"),
        NativeApp          = brackets.getModule("utils/NativeApp"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        ServerManager      = require("server/ServerManager"),
        ToolbarButton      = require("toolbar/ToolbarButton");

    var prefs = null;

    var CMD_STATIC_PREVIEW = "sbruchmann.staticpreview";

    function _launchDefaultBrowser(options) {
        var url = "http://" + options.hostname + ":" + options.port + "/";
        NativeApp.openURLInDefaultBrowser(url);
    }

    function _handleServerStateChange(event, data) {
        var isRunning = ServerManager.isRunning();

        CommandManager.get(CMD_STATIC_PREVIEW).setChecked(isRunning);

        if (isRunning) {
            _launchDefaultBrowser(data.reason.params);
        }
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
        ToolbarButton.init();
    }

    AppInit.appReady(_onAppReady);
});
