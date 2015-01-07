define(function (require) {
    "use strict";

    // Dependencies
    var CommandManager = brackets.getModule("command/CommandManager");
    var LocalServer = require("LocalServer");
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

    function handleStateChange(event, state) {
        isRunning = (state === LocalServer.STATE_RUNNING);
        CommandManager
            .get(COMMAND_ID)
            .setChecked(isRunning);
    }

    LocalServer.on("stateChange", handleStateChange);

    function toggleLocalServer() {
        if (!isRunning) {
            LocalServer.start();
        } else {
            LocalServer.stop();
        }
    }

    CommandManager.register("Static Preview", COMMAND_ID, toggleLocalServer);
    Menus.getMenu(Menus.AppMenuBar.FILE_MENU).addMenuItem(COMMAND_ID);
});
