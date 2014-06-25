define(function (require) {
    "use strict";

    var AppInit            = brackets.getModule("utils/AppInit"),
        CommandManager     = brackets.getModule("command/CommandManager"),
        Commands           = brackets.getModule("command/Commands"),
        Menus              = brackets.getModule("command/Menus"),
        ServerManager      = require("server/ServerManager"),
        SettingsManager    = require("settings/SettingsManager"),
        ToolbarButton      = require("toolbar/ToolbarButton");

    var CMD_STATIC_PREVIEW = "sbruchmann.staticpreview";

    function _handleServerStateChange() {
        CommandManager.get(CMD_STATIC_PREVIEW).setChecked(ServerManager.isRunning());
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
