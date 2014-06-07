/*globals $, brackets, define*/
define(function (require, exports, module) {
    "use strict";

    var _              = brackets.getModule("thirdparty/lodash"),
        AppInit        = brackets.getModule("utils/AppInit"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Commands       = brackets.getModule("command/Commands"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        Menus          = brackets.getModule("command/Menus"),
        NodeDomain     = brackets.getModule("utils/NodeDomain"),
        ProjectManager = brackets.getModule("project/ProjectManager");

    var _currentProject = null;

    var _DEFAULT_CONFIG = {
        hostname: "0.0.0.0",
        port: 3000
    };

    var DOMAIN_ID = "sbruchmann.staticdev";
    var DOMAIN_PATH = ExtensionUtils.getModulePath(module, "node/domain.js");

    var domain = new NodeDomain(DOMAIN_ID, DOMAIN_PATH);

    var CMD_STATIC_PREVIEW = "sbruchmann.staticpreview";

    var _isRunning = false;

    function _closeServer() {
        var command = CommandManager.get(CMD_STATIC_PREVIEW);
        var deferred = new $.Deferred();

        domain.exec("closeServer")
            .fail(deferred.reject.bind(deferred))
            .then(function _callback() {
                _isRunning = false;
                console.debug("[Static Preview] server closed.");
                command.setChecked(_isRunning);
                deferred.resolve();
            });

        return deferred.promise();
    }

    function _handleProjectClose(event, directory) {
        if (_isRunning) {
            _closeServer();
        }

        $(ProjectManager).off("projectClose", _handleProjectClose);
    }

    function _handleProjectOpen(event, directory) {
        _currentProject = directory;
    }

    function _launchServer() {
        var command = CommandManager.get(CMD_STATIC_PREVIEW);
        var config = _.cloneDeep(_DEFAULT_CONFIG);
        var deferred = new $.Deferred();

        // Make sure that we have a reference to the current project
        if (!_currentProject) {
            _currentProject = ProjectManager.getProjectRoot();
        }

        config.basepath = _currentProject.fullPath;

        $(ProjectManager).on("projectClose", _handleProjectClose);

        domain.exec("launchServer", config)
            .fail(function _errback(err) {
                console.error("[Static Preview]", err);
                deferred.reject(err);
            })
            .then(function _callback() {
                _isRunning = true;
                console.debug("[Static Preview] Launched server.", config);
                command.setChecked(_isRunning);
                deferred.resolve(config);
            });

        return deferred.promise();
    }

    function _toggleStaticPreview() {
        return _isRunning ? _closeServer() : _launchServer();
    }

    function _onAppReady() {
        var FILE_MENU = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        $(ProjectManager).on("projectOpen", _handleProjectOpen);

        CommandManager.register("Static Preview", CMD_STATIC_PREVIEW, _toggleStaticPreview);
        FILE_MENU.addMenuItem(
            CMD_STATIC_PREVIEW,
            null,
            Menus.AFTER,
            Commands.FILE_LIVE_FILE_PREVIEW
        );
    }

    AppInit.appReady(_onAppReady);
});
