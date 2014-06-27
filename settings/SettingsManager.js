define(function (require, exports) {
    "use strict";

    // Module dependencies
    var _                  = brackets.getModule("thirdparty/lodash"),
        DefaultDialogs     = brackets.getModule("widgets/DefaultDialogs"),
        Dialogs            = brackets.getModule("widgets/Dialogs"),
        DialogTemplate     = require("text!settings/dialog-settings.html"),
        ExtensionStrings   = require("i18n!nls/strings"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        ServerManager      = require("server/ServerManager"),
        Strings            = brackets.getModule("strings");

    /**
     * Reference to extension preferences; Gets initialized by `setupPreferences()`
     * @type {Object}
     */
    var _prefs = null;

    /**
     * Compiled template function.
     * @type {Function}
     * @param {Object} locals
     * @return {String} html
     */
    var _renderDialogTemplate = _.template(DialogTemplate);

    /**
     * Configuration of settings for use in `setupPreferences()`
     */
    var _settings = [
        {
            // Windows 7 does not resolve hostname `0.0.0.0`
            // @see https://github.com/sbruchmann/brackets-static-preview/issues/12
            default: brackets.platform === "win" ? "localhost" : "0.0.0.0",
            id: "hostname",
            label: ExtensionStrings.SETTING_HOSTNAME,
            type: "string"
        },
        {
            default: 3000,
            id: "port",
            label: ExtensionStrings.SETTING_PORT,
            type: "number"
        }
    ];

    /**
     * Returns the value for a specific setting.
     * @param {String} id
     * @return {?}
     */
    function getSetting(id) {
        return _prefs.get(id);
    }

    /**
     * @param {JQuery} $dlg Dialog
     * @param {String} action Action
     */
    function _handleDialogAction($dlg, action) {
        if (action === "cancel") {
            return;
        }

        if (action === "save-settings") {
            _settings.forEach(function _iterate(setting) {
                _prefs.set(setting.id, $dlg.find("#staticpreview-setting-" + setting.id).val());
                _prefs.save();
            });

            if (ServerManager.isRunning()) {
                _showRestartDialog();
            }
        }

        if (action === "restart-server") {
            ServerManager.restart();
        }
    }

    /**
     * Defines default preferences
     */
    function setupPreferences() {
        _prefs = PreferencesManager.getExtensionPrefs("sbruchmann.staticpreview");
        _settings.forEach(function _iterate(setting) {
            var id = setting.id;

            if (typeof _prefs.get(id) !== setting.type) {
                _prefs.definePreference(id, setting.type, setting.default);
                _prefs.set(id, setting.default);
            }
        });
    }

    function showSettingsDialog() {
        var $dlg = null;
        var dialog = Dialogs.showModalDialog(
            DefaultDialogs.DIALOG_ID_INFO,
            ExtensionStrings.DIALOG_SETTINGS_TITLE,
            _renderDialogTemplate({ settings: _settings }),
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
        _settings.forEach(function _iterate(setting) {
            $dlg.find("#staticpreview-setting-" + setting.id).val(
                _prefs.get(setting.id)
            );
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
    exports.getSetting = getSetting;
    exports.setupPreferences = setupPreferences;
    exports.showSettingsDialog = showSettingsDialog;
});
