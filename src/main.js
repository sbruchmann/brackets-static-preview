define(function (require, exports, module) {
    "use strict";

    // Dependencies
    var CommandManager = brackets.getModule("command/CommandManager");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    var LocalServer = require("LocalServer");
    var Menus = brackets.getModule("command/Menus");
    var ProjectManager = brackets.getModule("project/ProjectManager");

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

    function autoStopServer() {
        if (isRunning) {
            LocalServer.stop();
        }
    }

    function handleStateChange(event, state) {
        isRunning = (state === LocalServer.STATE_RUNNING);

        CommandManager
            .get(COMMAND_ID)
            .setChecked(isRunning);

        $toolbarBtn
            .attr("class", "") // Remove all previous class names
            .addClass(isRunning ? LocalServer.STATE_RUNNING : LocalServer.STATE_IDLE);
    }

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

    // Register events
    LocalServer.on("stateChange", handleStateChange);
    ProjectManager.on("beforeProjectClose", autoStopServer);

    ExtensionUtils
        .loadStyleSheet(module, "styles.less")
        .then(function callback() {
            $toolbarBtn.show();
        });
});
