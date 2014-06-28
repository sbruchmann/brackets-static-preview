define(function (require) {
    "use strict";

    var AppInit            = brackets.getModule("utils/AppInit"),
        CommandManager     = brackets.getModule("command/CommandManager"),
        Commands           = brackets.getModule("command/Commands"),
        Menus              = brackets.getModule("command/Menus"),
        NativeApp          = brackets.getModule("utils/NativeApp"),
        ServerManager      = require("server/ServerManager"),
        SettingsManager    = require("settings/SettingsManager"),
        Strings            = require("i18n!nls/strings"),
        ToolbarButton      = require("toolbar/ToolbarButton");

    var CMD_STATIC_PREVIEW = "sbruchmann.staticpreview";
    var CMD_STATIC_PREVIEW_SETTINGS = "sbruchmann.staticpreview.settings";

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

    function _toggleStaticPreview() {
        if (!ServerManager.isRunning()) {
            ServerManager.start();
        } else {
            ServerManager.stop();
        }
    }

    function _onAppReady() {
        var FILE_MENU = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        SettingsManager.setupPreferences();
        CommandManager.register(Strings.CMD_STATIC_PREVIEW, CMD_STATIC_PREVIEW, _toggleStaticPreview);
        CommandManager.register(Strings.CMD_STATIC_PREVIEW_SETTINGS, CMD_STATIC_PREVIEW_SETTINGS, SettingsManager.showSettingsDialog);
        $(ServerManager).on("stateChange", _handleServerStateChange);

        FILE_MENU.addMenuItem(
            CMD_STATIC_PREVIEW,
            null,
            Menus.AFTER,
            Commands.FILE_LIVE_FILE_PREVIEW
        );

        FILE_MENU.addMenuItem(
            CMD_STATIC_PREVIEW_SETTINGS,
            null,
            Menus.AFTER,
            CMD_STATIC_PREVIEW
        );

        ToolbarButton.init();
    }

    AppInit.appReady(_onAppReady);
});
