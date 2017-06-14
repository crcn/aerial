"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var levels_1 = require("./levels");
var messages_1 = require("../messages");
var LogEvent = (function (_super) {
    __extends(LogEvent, _super);
    function LogEvent(level, text, filterable) {
        var _this = _super.call(this, LogEvent.LOG) || this;
        _this.level = level;
        _this.text = text;
        _this.filterable = filterable;
        return _this;
    }
    return LogEvent;
}(messages_1.CoreEvent));
LogEvent.LOG = "log";
exports.LogEvent = LogEvent;
var LogTimer = (function () {
    function LogTimer(logger, intervalMessage, timeout, level) {
        if (level === void 0) { level = levels_1.LogLevel.INFO; }
        var _this = this;
        this.logger = logger;
        this.intervalMessage = intervalMessage;
        this.timeout = timeout;
        this.level = level;
        this._startTime = Date.now();
        if (intervalMessage && timeout && !process.env.TESTING) {
            this._interval = setInterval(function () {
                _this.logTime(intervalMessage);
            }, timeout);
        }
    }
    LogTimer.prototype.stop = function (message) {
        clearInterval(this._interval);
        this.logTime(message || "completed");
    };
    LogTimer.prototype.logTime = function (message) {
        this.logger.log(this.level, message + " %ss", ((Date.now() - this._startTime) / 1000).toFixed(0));
    };
    return LogTimer;
}());
exports.LogTimer = LogTimer;
var Logger = (function () {
    function Logger(bus, prefix, _parent) {
        if (prefix === void 0) { prefix = ""; }
        this.bus = bus;
        this.prefix = prefix;
        this._parent = _parent;
    }
    Logger.prototype.createChild = function (prefix) {
        if (prefix === void 0) { prefix = ""; }
        return new Logger(this.bus, prefix, this);
    };
    /**
     * Extra noisy logs which aren't very necessary
     */
    Logger.prototype.debug = function (text) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        this._log.apply(this, [levels_1.LogLevel.DEBUG, text].concat(rest));
    };
    /**
     * @deprecated. Use verbose.
     * General logging information to help with debugging
     */
    Logger.prototype.log = function (level, text) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        this._log.apply(this, [level, text].concat(rest));
    };
    /**
     * log which should grab the attention of the reader
     */
    Logger.prototype.info = function (text) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        this._log.apply(this, [levels_1.LogLevel.INFO, text].concat(rest));
    };
    Logger.prototype.warn = function (text) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        this._log.apply(this, [levels_1.LogLevel.WARNING, text].concat(rest));
    };
    Logger.prototype.error = function (text) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        this._log.apply(this, [levels_1.LogLevel.ERROR, text].concat(rest));
    };
    Logger.prototype.startTimer = function (timeoutMessage, interval, logLevel) {
        if (interval === void 0) { interval = 5000; }
        return new LogTimer(this, timeoutMessage, interval, logLevel);
    };
    Logger.prototype.getPrefix = function () {
        var prefix = this.generatePrefix && this.generatePrefix() || this.prefix;
        if (this._parent) {
            prefix = this._parent.getPrefix() + prefix;
        }
        return prefix;
    };
    Logger.prototype._log = function (level, text) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        function stringify(value) {
            if (typeof value === "object") {
                value = JSON.stringify(value, null, 2);
            }
            return value;
        }
        text = stringify(text);
        var paramCount = (String(text).match(/%(d|s)/g) || []).length;
        var sprintfParams = params.slice(0, paramCount);
        var restParams = params.slice(paramCount);
        var message = [sprintf.apply(void 0, ["" + this.getPrefix() + text].concat(sprintfParams.map(stringify)))].concat(restParams).join(" ");
        this.bus.dispatch(new LogEvent(level, message, this.filterable));
    };
    return Logger;
}());
exports.Logger = Logger;
function sprintf(text) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    for (var _a = 0, params_1 = params; _a < params_1.length; _a++) {
        var param = params_1[_a];
        text = text.replace(/%\w/, param);
    }
    return text;
}
__export(require("./levels"));
//# sourceMappingURL=index.js.map