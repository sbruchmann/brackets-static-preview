define(function (require, exports, module) {
    "use strict";

    var EventDispatcher = brackets.getModule("utils/EventDispatcher");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    var NodeDomain = brackets.getModule("utils/NodeDomain");

    // Setup event dispatching
    EventDispatcher.makeEventDispatcher(exports);

    /**
     * @type {NodeDomain}
     * @private
     */
    var localServer = new NodeDomain(
        "sbruchmann.staticpreview.LocalServer",
        ExtensionUtils.getModulePath(module, "LocalServerDomain.js")
    );

    function start() {
        return localServer.exec("start");
    }

    function stop() {
        return localServer.exec("stop");
    }

    // Define public API
    exports.start = start;
    exports.stop = stop;
});
