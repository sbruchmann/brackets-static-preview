define(function (require) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        Commands       = require("command/Commands"),
        NativeApp      = brackets.getModule("utils/NativeApp"),
        ServerManager  = require("server/ServerManager"),
        Strings        = require("i18n!nls/strings");

    function _handleServerStateChange($event, data) {
        var isRunning = ServerManager.isRunning();

        CommandManager.get(Commands.STATIC_PREVIEW).setChecked(isRunning);

        if (isRunning) {
            _launchDefaultBrowser(data.reason.params);
        }
    }

    function _launchDefaultBrowser(options) {
        NativeApp.openURLInDefaultBrowser(
            "http://" + options.hostname + ":" + options.port + "/"
        );
    }

    function toggleServer() {
        if (!ServerManager.isRunning()) {
            ServerManager.start();
        } else {
            ServerManager.stop();
        }
    }

    CommandManager.register(Strings.CMD_STATIC_PREVIEW, Commands.STATIC_PREVIEW, toggleServer);

    $(ServerManager).on("stateChange", _handleServerStateChange);
});
