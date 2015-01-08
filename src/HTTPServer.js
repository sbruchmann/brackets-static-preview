"use strict";

var bodyParser = require("body-parser");
var connect = require("connect");
var cors = require("cors");
var livereload = require("connect-livereload-safe");
var http = require("http");
var sane = require("sane");
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");
var tinylr = require("tiny-lr");

function HTTPServer(options) {
    this._app = connect();
    this._connections = [];
    this._options = options;
    this._livereloadServer = tinylr();
    this._server = http.createServer(this._app);

    this._server.on("connection", this._handleConnection.bind(this));
    this._configure();
}

HTTPServer.prototype._configure = function _configure() {
    var app = this._app;
    var root = this._options.root;
    var watcher = sane(root);

    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(livereload({port: 35729}));
    app.use(serveStatic(root));
    app.use(serveIndex(root));

    watcher.on("change", (function callback(filepath) {
        this._livereloadServer.changed({
            body: {
                files: filepath.replace(root, "")
            }
        });
    }.bind(this)));
};

HTTPServer.prototype._handleConnection = function _handleConnection(connection) {
    var connections = this._connections;

    connections.push(connection);
    connection.on("close", function handleClose() {
        connections.splice(connections.indexOf(connection), 1);
    });
};

HTTPServer.prototype.close = function close(callback) {
    this._connections.forEach(function iterate(connection) {
        connection.destroy();
    });
    this._server.close(callback);
};

HTTPServer.prototype.listen = function listen(done) {
    var options = this._options;

    this._server.listen(options.port, options.hostname, (function callback() {
        this._livereloadServer.listen(35729);
        done(null);
    }.bind(this)));
};

module.exports = HTTPServer;
