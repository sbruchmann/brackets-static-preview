"use strict";

var express = require("express");
var http = require("http");
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");

function HTTPServer() {
    this._socketPool = [];
    this._server = null;
    this.app = null;

    return this;
}

HTTPServer.prototype._handleConnection = function _handleConnection(socket) {
    var _socketPool = this._socketPool;

    _socketPool.push(socket);
    socket.on("close", function _handleClose() {
        _socketPool.splice(_socketPool.indexOf(socket), 1);
    });

    return this;
};

HTTPServer.prototype._setup = function _setup(options) {
    var app = express();
    var basepath = options.basepath;

    app
        .use(serveStatic(basepath))
        .use(serveIndex(basepath));

    this._server = http.createServer(app);
    this.app = app;

    return this;
};

HTTPServer.prototype.close = function close(done) {
    var self = this;

    this._socketPool.forEach(function _iterate(socket) {
        socket.destroy();
    });
    this._server.close(function _callback(err) {
        if (err) {
            return done(err);
        }

        self._server = null;
        self._socketPool = [];
        self.app = null;

        done(null);
    });

    return this;
};

/**
 * @TODO Add general error handling (EACCES, EADDRINUSE, etc.)
 */
HTTPServer.prototype.launch = function launch(options, done) {
    this._setup(options);
    this._server
        .on("connection", this._handleConnection.bind(this))
        .listen(options.port, options.hostname, function _callback() {
            done(null, options);
        });

    return this;
};

module.exports = HTTPServer;
