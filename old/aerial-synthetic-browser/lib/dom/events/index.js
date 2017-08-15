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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common_1 = require("aerial-common");
var SyntheticDOMEvent = (function (_super) {
    __extends(SyntheticDOMEvent, _super);
    function SyntheticDOMEvent(type) {
        var _this = _super.call(this, type) || this;
        _this.type = type;
        return _this;
    }
    SyntheticDOMEvent.prototype.preventDefault = function () {
        // TODO
    };
    return SyntheticDOMEvent;
}(aerial_common_1.CoreEvent));
exports.SyntheticDOMEvent = SyntheticDOMEvent;
// http://www.w3schools.com/jsref/dom_obj_event.asp
var SyntheticMouseEvent = (function (_super) {
    __extends(SyntheticMouseEvent, _super);
    function SyntheticMouseEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticMouseEvent_1 = SyntheticMouseEvent;
    SyntheticMouseEvent.CLICK = "click";
    SyntheticMouseEvent.dblclick = "dblclick";
    SyntheticMouseEvent.MOUSE_DOWN = "mouseDown";
    SyntheticMouseEvent.MOUSE_ENTER = "mouseEnter";
    SyntheticMouseEvent.MOUSE_LEAVE = "mouseLeave";
    SyntheticMouseEvent.MOUSE_MOVE = "mouseMove";
    SyntheticMouseEvent.MOUSE_OVER = "mouseOver";
    SyntheticMouseEvent.MOUSE_OUT = "mouseOut";
    SyntheticMouseEvent.MOUSE_UP = "mouseUp";
    SyntheticMouseEvent = SyntheticMouseEvent_1 = __decorate([
        aerial_common_1.serializable("SyntheticMouseEvent", {
            serialize: function (_a) {
                var type = _a.type;
                return [type];
            },
            deserialize: function (_a) {
                var type = _a[0];
                return new SyntheticMouseEvent_1(type);
            }
        })
    ], SyntheticMouseEvent);
    return SyntheticMouseEvent;
    var SyntheticMouseEvent_1;
}(SyntheticDOMEvent));
exports.SyntheticMouseEvent = SyntheticMouseEvent;
// for testing in chrome console -- remove this eventually
global["SyntheticMouseEvent"] = SyntheticMouseEvent;
var SyntheticKeyboardEvent = (function (_super) {
    __extends(SyntheticKeyboardEvent, _super);
    function SyntheticKeyboardEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticKeyboardEvent_1 = SyntheticKeyboardEvent;
    SyntheticKeyboardEvent.KEY_DOWN = "keyDown";
    SyntheticKeyboardEvent.KEY_PRESS = "keyPress";
    SyntheticKeyboardEvent.KEY_UP = "keyUp";
    SyntheticKeyboardEvent = SyntheticKeyboardEvent_1 = __decorate([
        aerial_common_1.serializable("SyntheticKeyboardEvent", {
            serialize: function (_a) {
                var type = _a.type;
                return [type];
            },
            deserialize: function (_a) {
                var type = _a[0];
                return new SyntheticKeyboardEvent_1(type);
            }
        })
    ], SyntheticKeyboardEvent);
    return SyntheticKeyboardEvent;
    var SyntheticKeyboardEvent_1;
}(SyntheticDOMEvent));
exports.SyntheticKeyboardEvent = SyntheticKeyboardEvent;
var DOMEventTypes;
(function (DOMEventTypes) {
    /**
     * Fired when all nodes have been added to the Document object -- different from LOAD
     * since DOM_CONTENT_LOADED doesn't wait for other assets such as stylesheet loads.
     */
    DOMEventTypes.DOM_CONTENT_LOADED = "DOMContentLoaded";
    /**
     * Fired after all assets and DOM content has loaded
     */
    DOMEventTypes.LOAD = "load";
    /**
     * Fired when a location object property changes
     */
    DOMEventTypes.POP_STATE = "popState";
})(DOMEventTypes = exports.DOMEventTypes || (exports.DOMEventTypes = {}));
var DOMEventDispatcher = (function () {
    function DOMEventDispatcher(type, listener) {
        this.type = type;
        this.listener = listener;
    }
    DOMEventDispatcher.prototype.dispatch = function (event) {
        // TODO - check bool return value from event listener
        if (event.type === this.type) {
            this.listener(event);
        }
    };
    return DOMEventDispatcher;
}());
exports.DOMEventDispatcher = DOMEventDispatcher;
// TODO - implement capture bool check
var DOMEventDispatcherMap = (function () {
    function DOMEventDispatcherMap(target) {
        this.target = target;
        this._map = new Map();
    }
    DOMEventDispatcherMap.prototype.add = function (type, listener, capture) {
        var observer = new DOMEventDispatcher(type, listener);
        if (!this._map.has(type)) {
            this._map.set(type, []);
        }
        this._map.get(type).push(observer);
        this.target.observe(observer);
    };
    DOMEventDispatcherMap.prototype.remove = function (type, listener, capture) {
        var observers = this._map.get(type) || [];
        for (var i = observers.length; i--;) {
            var observer = observers[i];
            if (observer.listener === listener) {
                observers.splice(i, 1);
                this.target.unobserve(observer);
                break;
            }
        }
    };
    return DOMEventDispatcherMap;
}());
exports.DOMEventDispatcherMap = DOMEventDispatcherMap;
//# sourceMappingURL=index.js.map