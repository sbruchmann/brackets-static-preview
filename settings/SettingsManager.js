define(function (require, exports) {
    "use strict";

    // Module dependencies
    var PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        ProjectManager     = brackets.getModule("project/ProjectManager"),
        Settings           = require("settings/Settings");

    /**
     * Reference to extension preferences; Gets initialized by `setupPreferences()`
     * @type {Object}
     */
    var _prefs = null;

    /**
     * Returns the value for a specific setting.
     * @param {String} id
     * @return {?}
     */
    function get(id) {
        return _prefs.get(id);
    }

    /**
     * @param {String} settingsId
     * @param {*} value
     */
    function set(settingsId, value) {
        /**
         * @NOTE This is a quick hack for #26.
         */
        if (settingsId === "basepath") {
            _prefs.set(settingsId, value, {
                location: {
                    scope: "project"
                }
            });
        } else {
            _prefs.set(settingsId, value);
        }
        _prefs.save();
    }

    /**
     * Defines default preferences
     */
    function init() {
        _prefs = PreferencesManager.getExtensionPrefs("sbruchmann.staticpreview");
        Settings.each(function _iterate(id, setting) {
            if (typeof _prefs.get(id) !== setting.type) {
                /**
                 * @NOTE Quick hack for #26
                 */
                if (id === "basepath") {
                    setting.default = ProjectManager.getProjectRoot().fullPath;
                }
                _prefs.definePreference(id, setting.type, setting.default);
                set(id, setting.default);
            }
        });
    }

    // Define public API
    exports.get = get;
    exports.init = init;
    exports.set = set;
});
