define(function (require, exports, module) {
    "use strict";

    var EventDispatcher = brackets.getModule("utils/EventDispatcher");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    var NodeDomain = brackets.getModule("utils/NodeDomain");
    var ProjectManager = brackets.getModule("project/ProjectManager");

    // Setup event dispatching
    EventDispatcher.makeEventDispatcher(exports);

    /**
     * @const
     * @type {string}
     * @public
     */
    var STATE_IDLE = "idle";

    /**
     * @const
     * @type {string}
     * @public
     */
    var STATE_RUNNING = "running";

    /**
     * @type {NodeDomain}
     * @private
     */
    var localServer = new NodeDomain(
        "sbruchmann.staticpreview.LocalServer",
        ExtensionUtils.getModulePath(module, "LocalServerDomain.js")
    );

    function start() {
        var options = {
            hostname: "localhost",
            port: 3000,
            root: ProjectManager.getProjectRoot().fullPath
        };

        return localServer.exec("start", options).then(function callback() {
            exports.trigger("stateChange", STATE_RUNNING);
        });
    }

    function stop() {
        return localServer.exec("stop").then(function callback() {
            exports.trigger("stateChange", STATE_IDLE);
        });
    }

    // Define public API
    exports.STATE_IDLE = STATE_IDLE;
    exports.STATE_RUNNING = STATE_RUNNING;
    exports.start = start;
    exports.stop = stop;
});
