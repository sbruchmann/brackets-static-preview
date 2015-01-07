"use strict";

var connect = require("connect");
var http = require("http");

function HTTPServer() {
    this._app = connect();
    this._connections = [];
    this._server = http.createServer(this._app);

    this._server.on("connection", this._handleConnection.bind(this));
}

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
    this._server.listen(3000, "localhost", callback);
};

module.exports = HTTPServer;
