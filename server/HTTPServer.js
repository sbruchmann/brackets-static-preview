"use strict";

var bodyParser = require("body-parser");
var cors = require("cors");
var express = require("express");
var http = require("http");
var livereload = require("connect-livereload-safe");
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");
var sane = require("sane");
var tinylr = require("tiny-lr");

function HTTPServer() {
    this._socketPool = [];
    this._httpServer = null;
    this._lrServer = tinylr();
    this._watcher = null;
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
    var lrServer = this._lrServer;
    var watcher = sane(basepath);

    app
        .use(cors())
        .use(bodyParser.urlencoded({ extended: true }))
        .use(livereload({ port: options.livereloadPort }))
        .use(serveStatic(basepath))
        .use(serveIndex(basepath));

    watcher.on("change", function _onChange(filepath) {
        lrServer.changed({
            body: {
                files: filepath.replace(basepath, "")
            }
        });
    });

    this._httpServer = http.createServer(app);
    this._watcher = watcher;
    this.app = app;

    return this;
};

HTTPServer.prototype.stop = function stop(done) {
    var self = this;

    this._socketPool.forEach(function _iterate(socket) {
        socket.destroy();
    });
    this._httpServer.close(function _callback(err) {
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
HTTPServer.prototype.start = function start(options, done) {
    var lrServer = this._lrServer;

    this._setup(options);
    this._httpServer
        .on("connection", this._handleConnection.bind(this))
        .listen(options.port, options.hostname, function _callback() {
            lrServer.listen(options.livereloadPort);
            done(null, options);
        });

    return this;
};

module.exports = HTTPServer;
