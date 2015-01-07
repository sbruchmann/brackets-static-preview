define(function () {
    "use strict";

    // Dependencies
    var CommandManager = brackets.getModule("command/CommandManager");
    var Menus = brackets.getModule("command/Menus");

    /**
     * @const
     * @type {string}
     * @private
     */
    var COMMAND_ID = "sbruchmann.staticpreview.toggleHTTPServer";

    /**
     * @type {boolean}
     * @private
     */
    var isRunning = false;

    function toggleHTTPServer() {
        isRunning = !isRunning;
        CommandManager.get(COMMAND_ID).setChecked(isRunning);
    }

    CommandManager.register("Static Preview", COMMAND_ID, toggleHTTPServer);
    Menus.getMenu(Menus.AppMenuBar.FILE_MENU).addMenuItem(COMMAND_ID);
});
