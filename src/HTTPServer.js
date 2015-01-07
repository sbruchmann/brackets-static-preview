"use strict";

var connect = require("connect");
var http = require("http");
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");

function HTTPServer(options) {
    this._app = connect();
    this._connections = [];
    this._options = options;
    this._server = http.createServer(this._app);

    this._server.on("connection", this._handleConnection.bind(this));
    this._configure();
}

HTTPServer.prototype._configure = function _configure() {
    var app = this._app;
    var root = this._options.root;

    app.use(serveStatic(root));
    app.use(serveIndex(root));
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

HTTPServer.prototype.listen = function listen(callback) {
    var options = this._options;

    this._server.listen(options.port, options.hostname, callback);
};

module.exports = HTTPServer;
