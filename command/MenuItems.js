define(function (require, exports) {
    "use strict";

    var BracketsCommands  = brackets.getModule("command/Commands"),
        ExtensionCommands = require("command/Commands"),
        Menus             = brackets.getModule("command/Menus");

    var FILE_MENU = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

    function init() {
        FILE_MENU.addMenuItem(
            ExtensionCommands.STATIC_PREVIEW,
            null,
            Menus.AFTER,
            BracketsCommands.FILE_LIVE_FILE_PREVIEW
        );

        FILE_MENU.addMenuItem(
            ExtensionCommands.STATIC_PREVIEW_SETTINGS,
            null,
            Menus.AFTER,
            ExtensionCommands.STATIC_PREVIEW
        );
    }

    // Define public API
    exports.init = init;
});
