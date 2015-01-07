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
    var httpServer = new NodeDomain(
        "sbruchmann.staticpreview.HTTPServer",
        ExtensionUtils.getModulePath(module, "HTTPServerDomain.js")
    );

    /**
     * @type {boolean}
     * @private
     */
    var isRunning = false;

    function toggleHTTPServer() {
        httpServer.exec(!isRunning ? "start" : "stop")
            .done(function callback() {
               isRunning = !isRunning;
            })
            .always(function callback() {
                CommandManager.get(COMMAND_ID).setChecked(isRunning);
            });
    }

    CommandManager.register("Static Preview", COMMAND_ID, toggleHTTPServer);
    Menus.getMenu(Menus.AppMenuBar.FILE_MENU).addMenuItem(COMMAND_ID);
});
