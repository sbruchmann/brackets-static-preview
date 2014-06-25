define(function (require, exports) {
    "use strict";

    // Module dependencies
    var _                  = brackets.getModule("thirdparty/lodash"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager");

    /**
     * Reference to extension preferences; Gets initialized by `setupPreferences()`
     * @type {Object}
     */
    var _prefs = null;

    /**
     * Configuration of settings for use in `setupPreferences()`
     */
    var _settings = {
        hostname: {
            default: "0.0.0.0",
            type: "string"
        },
        port: {
            default: 3000,
            type: "number"
        }
    };

    /**
     * Defines default preferences
     */
    function setupPreferences() {
        _prefs = PreferencesManager.getExtensionPrefs("sbruchmann.staticpreview");
        _.each(_settings, function _iterate(setting, id) {
            if (typeof _prefs.get(id) !== setting.type) {
                _prefs.definePreference(id, setting.type, setting["default"]);
                _prefs.set(id, setting["default"]);
                _prefs.save();
            }
        });
    }

    // Define public API
    exports.setupPreferences = setupPreferences;
});
