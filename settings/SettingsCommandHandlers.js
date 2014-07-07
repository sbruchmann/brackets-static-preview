define(function (require) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        Commands       = require("command/Commands"),
        SettingsDialog = require("settings/SettingsDialog"),
        Strings        = require("i18n!nls/strings");

    function showSettingsDialog() {
        SettingsDialog.show();
    }

    CommandManager.register(
        Strings.CMD_STATIC_PREVIEW_SETTINGS,
        Commands.STATIC_PREVIEW_SETTINGS,
        showSettingsDialog
    );
});
