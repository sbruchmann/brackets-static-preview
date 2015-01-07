define(function (require, exports, module) {
    "use strict";

    // Dependencies
    var CommandManager = brackets.getModule("command/CommandManager");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    var Menus = brackets.getModule("command/Menus");
    var NodeDomain = brackets.getModule("utils/NodeDomain");

    /**
     * @const
     * @type {string}
     * @private
     */
    var COMMAND_ID = "sbruchmann.staticpreview.toggleHTTPServer";

    /**
     * @type {NodeDomain}
     * @private
     */
    var localServer = new NodeDomain(
        "sbruchmann.staticpreview.LocalServer",
        ExtensionUtils.getModulePath(module, "LocalServerDomain.js")
    );

    /**
     * @type {boolean}
     * @private
     */
    var isRunning = false;

    function toggleLocalServer() {
        localServer.exec(!isRunning ? "start" : "stop")
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
