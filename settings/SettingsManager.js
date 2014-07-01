define(function (require, exports) {
    "use strict";

    // Module dependencies
    var _                  = brackets.getModule("thirdparty/lodash"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
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
        _prefs.set(settingsId, value);
        _prefs.save();
    }

    /**
     * Defines default preferences
     */
    function setupPreferences() {
        _prefs = PreferencesManager.getExtensionPrefs("sbruchmann.staticpreview");
        Settings.each(function _iterate(id, setting) {
            if (typeof _prefs.get(id) !== setting.type) {
                _prefs.definePreference(id, setting.type, setting.default);
                set(id, setting.default);
            }
        });
    }

    // Define public API
    exports.get = get;
    exports.set = set;
    exports.setupPreferences = setupPreferences;
});
