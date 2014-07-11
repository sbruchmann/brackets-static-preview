define(function (require, exports, module) {
    "use strict";

    var _              = brackets.getModule("thirdparty/lodash"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Commands       = require("command/Commands"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        Nls            = require("i18n!nls/strings"),
        ServerManager  = require("server/ServerManager");

    var _allClasses = null;
    var _classPrefix = "is-";
    var _classNames = {};

    _classNames[ServerManager.STATE_ID_CRASHED] = _classPrefix + ServerManager.STATE_ID_CRASHED;
    _classNames[ServerManager.STATE_ID_IDLE] = _classPrefix + ServerManager.STATE_ID_IDLE;
    _classNames[ServerManager.STATE_ID_RUNNING] = _classPrefix + ServerManager.STATE_ID_RUNNING;
    _allClasses = _.values(_classNames).join(" ");

    var $btn = $("<a id='toolbar-staticpreview' href='' title='" + Nls.TOOLBAR_LABEL_START + "'></a>");

    function _handleStateChange(event, params) {
        var label = ServerManager.isRunning() ? Nls.TOOLBAR_LABEL_STOP : Nls.TOOLBAR_LABEL_START;

        $btn
            .removeClass(_allClasses)
            .addClass(_classNames[params.stateId])
            .attr("title", label);
    }

    function init() {
        ExtensionUtils.loadStyleSheet(module, "styles.css")
            .then(function _callback() {
                $btn.appendTo("#main-toolbar .buttons")
                .click(function() {
                    CommandManager.execute(Commands.STATIC_PREVIEW);
                });
                $(ServerManager).on("stateChange", _handleStateChange);
            });
    }

    // Define public API
    exports.init = init;

});
