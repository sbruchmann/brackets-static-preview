/*globals $, brackets, define*/
define(function (require) {
    "use strict";

    var AppInit        = brackets.getModule("utils/AppInit"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Menus          = brackets.getModule("command/Menus"),
        ProjectManager = brackets.getModule("project/ProjectManager");

    var _currentProject = null;

    var STATIC_DEVELOPMENT_LAUNCH = "sbruchmann.staticdev.launch";

    function _handleStaticDevelopmentLaunch() {
        var basepath;

        if (!_currentProject) {
            _currentProject = ProjectManager.getProjectRoot();
        }

        basepath = _currentProject.fullPath;
        alert("Starting Static Development server at " + basepath);
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
