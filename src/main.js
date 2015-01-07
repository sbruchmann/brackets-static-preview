define(function (require, exports, module) {
    "use strict";

    // Dependencies
    var CommandManager = brackets.getModule("command/CommandManager");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    var LocalServer = require("LocalServer");
    var Menus = brackets.getModule("command/Menus");

    /**
     * @const
     * @type {string}
     * @private
     */
    var COMMAND_ID = "sbruchmann.staticpreview.toggleHTTPServer";

    /**
     * @type {JQuery}
     * @private
     */
    var $toolbarBtn = $(document.createElement("a"));

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

        $toolbarBtn
            .attr("class", "") // Remove all previous class names
            .addClass(isRunning ? LocalServer.STATE_RUNNING : LocalServer.STATE_IDLE);
    }

    LocalServer.on("stateChange", handleStateChange);

    function toggleLocalServer() {
        if (!isRunning) {
            LocalServer.start();
        } else {
            LocalServer.stop();
        }
    }

    $toolbarBtn
        .prop("id", "static-preview__toggle")
        .hide()
        .appendTo("#main-toolbar .buttons")
        .click(function handleClick() {
            CommandManager.execute(COMMAND_ID);
        });

    CommandManager.register("Static Preview", COMMAND_ID, toggleLocalServer);
    Menus.getMenu(Menus.AppMenuBar.FILE_MENU).addMenuItem(COMMAND_ID);

    ExtensionUtils
        .loadStyleSheet(module, "styles.less")
        .then(function callback() {
            console.debug("Done");
            $toolbarBtn.show();
        });
});
