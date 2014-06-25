define(function (require, exports) {
    "use strict";

    // Module dependencies
    var PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        ServerManager      = require("server/ServerManager");

    /**
     * Reference to extension preferences; Gets initialized by `setupPreferences()`
     * @type {Object}
     */
    var _prefs = null;

    /**
     * Defines default preferences
     */
    function setupPreferences() {
        var defaults = ServerManager.getDefaultConfig();

        _prefs = PreferencesManager.getExtensionPrefs("sbruchmann.staticpreview");

        if (typeof _prefs.get("port") !== "number") {
            _prefs.definePreference("port", "number", defaults.port);
            _prefs.set("port", defaults.port);
            _prefs.save();
        }

        if (typeof _prefs.get("hostname") !== "string") {
            _prefs.definePreference("hostname", "string", defaults.hostname);
            _prefs.set("hostname", defaults.hostname);
            _prefs.save();
        }
    }

    // Define public API
    exports.setupPreferences = setupPreferences;
});
