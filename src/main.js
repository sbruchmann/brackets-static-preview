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

    function toggleLocalServer() {
        var promise = !isRunning ? LocalServer.start() : LocalServer.stop();

        promise
            .done(function callback() {
               isRunning = !isRunning;
            })
            .always(function callback() {
                CommandManager.get(COMMAND_ID).setChecked(isRunning);
            });
    }

    CommandManager.register("Static Preview", COMMAND_ID, toggleLocalServer);
    Menus.getMenu(Menus.AppMenuBar.FILE_MENU).addMenuItem(COMMAND_ID);
});
