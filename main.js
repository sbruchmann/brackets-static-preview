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

    var STATIC_DEVELOPMENT_LAUNCH = "sbruchmann.staticdev.launch";

    function _handleStaticDevelopmentLaunch() {
        var config = {
            basepath: null,
            hostname: "0.0.0.0",
            port: 3000
        };
        var deferred = new $.Deferred();
        var reject = deferred.reject.bind(deferred);
        var resolve = deferred.resolve.bind(deferred);

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
                resolve(config);
            });

        return deferred.promise();
    }

    function _handleProjectClose(event, directory) {
    }

    function _handleProjectOpen(event, directory) {
        _currentProject = directory;
    }

    function _onAppReady() {
        var FILE_MENU = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        $(ProjectManager).on({
            "projectOpen": _handleProjectOpen,
            "projectClose": _handleProjectClose
        });

        CommandManager.register("Static Preview", STATIC_DEVELOPMENT_LAUNCH, _handleStaticDevelopmentLaunch);
        FILE_MENU.addMenuItem(STATIC_DEVELOPMENT_LAUNCH);
    }

    AppInit.appReady(_onAppReady);
});
