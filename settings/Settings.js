define(function (require, exports) {
    "use strict";

    var Strings = require("i18n!nls/strings");

    /**
     * Configuration of settings for use in `setupPreferences()`
     */
    var _settings = [
        {
            // Windows 7 does not resolve hostname `0.0.0.0`
            // @see https://github.com/sbruchmann/brackets-static-preview/issues/12
            default: brackets.platform === "win" ? "localhost" : "0.0.0.0",
            id: "hostname",
            label: Strings.SETTING_HOSTNAME,
            type: "string"
        },
        {
            default: 3000,
            id: "port",
            label: Strings.SETTING_PORT,
            type: "number"
        }
    ];

    /**
     * Abstraction for iterating over settings.
     * @param {Function<(String, Object)>} iterator
     */
    function each(iterator) {
        _settings.forEach(function _iterate(setting) {
            iterator(setting.id, setting);
        });
    }

    // Define public API
    exports.each = each;
});
