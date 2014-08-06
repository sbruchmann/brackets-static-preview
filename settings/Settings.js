define(function (require, exports) {
    "use strict";

    var Strings = require("i18n!nls/strings");

    /**
     * Configuration of settings for use in `setupPreferences()`
     */
    var _settings = [
        {
            default: "localhost",
            id: "hostname",
            label: Strings.SETTING_HOSTNAME,
            type: "string"
        },
        {
            default: 3000,
            id: "port",
            label: Strings.SETTING_PORT,
            type: "number"
        },
        {
            default: 35729,
            id: "livereloadPort",
            label: Strings.SETTING_LIVERELOADPORT,
            type: "number"
        },
        {
            default: "",
            id: "basepath",
            label: Strings.SETTING_BASEPATH,
            type: "string"
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
