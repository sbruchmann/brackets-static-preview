define(function (require) {
    "use strict";

    var AppInit            = brackets.getModule("utils/AppInit"),
        MenuItems          = require("command/MenuItems"),
        SettingsManager    = require("settings/SettingsManager"),
        ToolbarButton      = require("toolbar/ToolbarButton");

    require("server/ServerCommandHandlers");
    require("settings/SettingsCommandHandlers");

    function _onAppReady() {
        SettingsManager.init();
        MenuItems.init();
        ToolbarButton.init();
    }

    AppInit.appReady(_onAppReady);
});
