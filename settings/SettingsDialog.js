define(function (require, exports) {

    var _                  = brackets.getModule("thirdparty/lodash"),
        DefaultDialogs     = brackets.getModule("widgets/DefaultDialogs"),
        Dialogs            = brackets.getModule("widgets/Dialogs"),
        DialogTemplate     = require("text!settings/dialog-settings.html"),
        ExtensionStrings   = require("i18n!nls/strings"),
        ProjectManager     = brackets.getModule("project/ProjectManager"),
        ServerManager      = require("server/ServerManager"),
        Settings           = require("settings/Settings"),
        SettingsManager    = require("settings/SettingsManager"),
        Strings            = brackets.getModule("strings");

    /**
     * Compiled template function.
     * @type {Function}
     * @param {Object} locals
     * @return {String} html
     */
    var _renderDialogTemplate = _.template(DialogTemplate);

    /**
     * @type {String}
     */
    var _selectorPrefix = "#staticpreview-setting-";

    /**
     * @param {JQuery} $dlg Dialog
     * @param {String} action Action
     */
    function _handleDialogAction($dlg, action) {
        if (action === "cancel") {
            return;
        }

        if (action === "save-settings") {
            Settings.each(function (id) {
                SettingsManager.set(id,
                  $dlg.find(_selectorPrefix + id).val()
                );
            });

            if (ServerManager.isRunning()) {
                _showRestartDialog();
            }
        }

        if (action === "restart-server") {
            ServerManager.restart();
        }
    }

    function show() {
        var $dlg = null;
        var dialog = Dialogs.showModalDialog(
            DefaultDialogs.DIALOG_ID_INFO,
            ExtensionStrings.DIALOG_SETTINGS_TITLE,
            _renderDialogTemplate({ eachSetting: Settings.each }),
            [
                {
                    className: Dialogs.DIALOG_BTN_CLASS_NORMAL,
                    id: Dialogs.DIALOG_BTN_CANCEL,
                    text: Strings.CANCEL,
                },
                {
                    className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
                    id: "save-settings",
                    text: Strings.DONE
                }
            ]
        );

        $dlg = dialog.getElement();
        Settings.each(function _iterate(id) {
            /**
             * @NOTE Quick hack for #26
             */
            if (id !== "basepath") {
                $dlg.find(_selectorPrefix + id).val(SettingsManager.get(id));
            } else {
                $dlg.find(_selectorPrefix + id).val(
                    SettingsManager.get(id) || ProjectManager.getProjectRoot().fullPath
                );
            }
        });
        dialog.getPromise().then(_handleDialogAction.bind(null, $dlg));
    }

    function _showRestartDialog() {
        Dialogs.showModalDialog(
            DefaultDialogs.DIALOG_ID_INFO,
            ExtensionStrings.DIALOG_RESTART_TITLE,
            ExtensionStrings.DIALOG_RESTART_TEXT,
            [
                {
                    className: Dialogs.DIALOG_BTN_CLASS_NORMAL,
                    id: Dialogs.DIALOG_BTN_CANCEL,
                    text: Strings.CANCEL
                },
                {
                    className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
                    id: "restart-server",
                    text: ExtensionStrings.RESTART
                }
            ]
        ).getPromise().then(_handleDialogAction.bind(null, null));
    }

    // Define public API
    exports.show = show;
});
