/*globals $, brackets, define*/
define(function (require, exports, module) {
    "use strict";

    var AppInit        = brackets.getModule("utils/AppInit"),
        CommandManager = brackets.getModule("command/CommandManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        Menus          = brackets.getModule("command/Menus"),
        NodeDomain     = brackets.getModule("utils/NodeDomain"),
        ProjectManager = brackets.getModule("project/ProjectManager");

    var _currentProject = null;

    var DOMAIN_ID = "sbruchmann.staticdev";
    var DOMAIN_PATH = ExtensionUtils.getModulePath(module, "node/domain.js");

    var domain = new NodeDomain(DOMAIN_ID, DOMAIN_PATH);

    var CMD_STATIC_PREVIEW = "sbruchmann.staticpreview";

    var _isRunning = false;

    function _handleProjectClose(event, directory) {
    }

    function _handleProjectOpen(event, directory) {
        _currentProject = directory;
    }

    function _handleStaticPreview() {
        var command = CommandManager.get(CMD_STATIC_PREVIEW);
        var config = {
            basepath: null,
            hostname: "0.0.0.0",
            port: 3000
        };
        var deferred = new $.Deferred();
        var reject = deferred.reject.bind(deferred);
        var resolve = deferred.resolve.bind(deferred);

        console.debug("[Static Preview] _isRunning", _isRunning);

        if (_isRunning) {
            console.debug("[Static Preview] Attempting to close server");
            domain.exec("closeServer")
                .fail(function _errback(err) {
                    console.error("[Static Preview]", err);
                })
                .then(function _callback() {
                    console.debug("[Static Preview] server closed.");
                    _isRunning = false;
                    command.setChecked(_isRunning);
                    resolve();
                });

            return deferred.promise();
        }

        if (!_currentProject) {
            _currentProject = ProjectManager.getProjectRoot();
        }

        config.basepath = _currentProject.fullPath;

        domain.exec("launchServer", config)
            .fail(function _errback(err) {
                console.error("[Static Development]", err);
                reject(err);
            })
            .then(function _callback() {
                console.debug("[Static Development] Launched server.", config);
                _isRunning = true;
                command.setChecked(_isRunning);
                resolve(config);
            });

        return deferred.promise();
    }

    function _onAppReady() {
        var FILE_MENU = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        $(ProjectManager).on({
            "projectOpen": _handleProjectOpen,
            "projectClose": _handleProjectClose
        });

        CommandManager.register("Static Preview", CMD_STATIC_PREVIEW, _handleStaticPreview);
        FILE_MENU.addMenuItem(CMD_STATIC_PREVIEW);
    }

    AppInit.appReady(_onAppReady);
});
