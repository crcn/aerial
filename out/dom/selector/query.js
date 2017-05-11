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
var lodash_1 = require("lodash");
var tester_1 = require("./tester");
var markup_1 = require("../markup");
var common_1 = require("@tandem/common");
var mesh_1 = require("@tandem/mesh");
function isDocumentOrShadow(node) {
    return node.nodeType === markup_1.DOMNodeType.DOCUMENT || node.nodeType === markup_1.DOMNodeType.DOCUMENT_FRAGMENT;
}
function createSyntheticDOMWalker(each, deep) {
    if (deep === void 0) { deep = true; }
    var walker = {
        stop: function () {
            this._stopped = true;
        },
        accept: function (node) {
            if (!this._stopped && (node.nodeType === markup_1.DOMNodeType.ELEMENT || (deep && isDocumentOrShadow(node)))) {
                if (each(node, this) !== false && !this._stopped) {
                    node.visitWalker(this);
                }
            }
        }
    };
    return walker;
}
exports.createSyntheticDOMWalker = createSyntheticDOMWalker;
function querySelector(node, selectorSource) {
    var found;
    var tester = tester_1.getSelectorTester(selectorSource, node);
    // no deep -- nwmatcher busts otherwise
    var walker = createSyntheticDOMWalker(function (node) {
        // no shadows
        if (node.nodeType === markup_1.DOMNodeType.DOCUMENT_FRAGMENT)
            return false;
        if (tester.test(node)) {
            found = node;
            walker.stop();
        }
    });
    walker.accept(node);
    return found;
}
exports.querySelector = querySelector;
function querySelectorAll(node, selectorSource) {
    var found = [];
    var tester = tester_1.getSelectorTester(selectorSource, node);
    var walker = createSyntheticDOMWalker(function (node) {
        // no shadows
        if (node.nodeType === markup_1.DOMNodeType.DOCUMENT_FRAGMENT)
            return false;
        if (tester.test(node)) {
            found.push(node);
        }
    });
    walker.accept(node);
    return found;
}
exports.querySelectorAll = querySelectorAll;
function selectorMatchesElement(selector, element) {
    var tester = tester_1.getSelectorTester(selector, element);
    return tester.test(element);
}
exports.selectorMatchesElement = selectorMatchesElement;
var ELEMENT_QUERY_TIMEOUT = 10;
/**
 * Speedier version of querySelector with a few additional features
 *
 * @export
 * @abstract
 * @class BaseElementQuerier
 * @extends {Observable}
 * @implements {IElementQuerier<T>}
 * @template T
 */
var BaseElementQuerier = (function (_super) {
    __extends(BaseElementQuerier, _super);
    function BaseElementQuerier(target, selector, filter) {
        var _this = _super.call(this) || this;
        _this.debounceReset = lodash_1.throttle(function () {
            if (_this._disposed)
                return;
            _this.reset();
        }, ELEMENT_QUERY_TIMEOUT);
        _this.target = target;
        _this.selector = selector;
        _this.filter = filter;
        _this._queriedElements = [];
        _this.targetWatcher = new common_1.PropertyWatcher(_this, "target");
        _this.filterWatcher = new common_1.PropertyWatcher(_this, "target");
        _this.selectorWatcher = new common_1.PropertyWatcher(_this, "target");
        _this.queriedElementsWatcher = new common_1.PropertyWatcher(_this, "queriedElements");
        // all of this stuff may be set at the same time, so add a debounce. Besides, ElementQuerier
        // is intended to be asyncronous
        _this.targetWatcher.connect(_this.debounceReset);
        _this.filterWatcher.connect(_this.debounceReset);
        _this.selectorWatcher.connect(_this.debounceReset);
        _this.reset();
        return _this;
    }
    Object.defineProperty(BaseElementQuerier.prototype, "queriedElements", {
        get: function () {
            return this._queriedElements;
        },
        enumerable: true,
        configurable: true
    });
    BaseElementQuerier.prototype.setQueriedElements = function (newQueriedElements) {
        var oldQueriedElements = this._queriedElements;
        this.notify(new common_1.PropertyMutation(common_1.PropertyMutation.PROPERTY_CHANGE, this, "queriedElements", this._queriedElements = newQueriedElements, oldQueriedElements).toEvent());
    };
    BaseElementQuerier.prototype.dispose = function () {
        this._disposed = true;
        // this.watcher.dispose(); TODO
    };
    return BaseElementQuerier;
}(common_1.Observable));
__decorate([
    common_1.bindable()
], BaseElementQuerier.prototype, "target", void 0);
__decorate([
    common_1.bindable()
], BaseElementQuerier.prototype, "filter", void 0);
__decorate([
    common_1.bindable()
], BaseElementQuerier.prototype, "selector", void 0);
exports.BaseElementQuerier = BaseElementQuerier;
var SyntheticElementQuerier = (function (_super) {
    __extends(SyntheticElementQuerier, _super);
    function SyntheticElementQuerier(target, selector, filter) {
        if (selector === void 0) { selector = "*"; }
        var _this = _super.call(this, target, selector, filter) || this;
        _this._rootObserver = new mesh_1.CallbackDispatcher(_this.onRootEvent.bind(_this));
        return _this;
    }
    SyntheticElementQuerier.prototype.reset = function () {
        this.cleanup();
        if (!this.target)
            return this.setQueriedElements([]);
        this.target.observe(this._rootObserver);
        var found = [];
        var filter = this.filter || (function () { return true; });
        var tester = tester_1.getSelectorTester(this.selector, this.target);
        createSyntheticDOMWalker(function (node) {
            if (tester.test(node) && filter(node))
                found.push(node);
        }).accept(this.target);
        this.setQueriedElements(found);
    };
    SyntheticElementQuerier.prototype.createChildQuerier = function (selector, filter) {
        if (selector === void 0) { selector = "*"; }
        return new ChildElementQuerier(this, selector, filter);
    };
    SyntheticElementQuerier.prototype.onRootEvent = function (message) {
        // reset on ALL messages -- there are cases where Nodes may contain state that
        // parts of the app using this querier needs to access (metadata for example). Debounce so
        // the app doesn't get clobbered with expensive querySelectorAll requests.
        this.debounceReset();
    };
    SyntheticElementQuerier.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.cleanup();
    };
    SyntheticElementQuerier.prototype.cleanup = function () {
        if (this.target) {
            this.target.unobserve(this._rootObserver);
        }
    };
    return SyntheticElementQuerier;
}(BaseElementQuerier));
exports.SyntheticElementQuerier = SyntheticElementQuerier;
var ChildElementQuerier = (function (_super) {
    __extends(ChildElementQuerier, _super);
    function ChildElementQuerier(parent, selector, filter) {
        if (selector === void 0) { selector = "*"; }
        var _this = _super.call(this, parent && parent.target, selector, filter) || this;
        _this.parentWatcher = new common_1.PropertyWatcher(_this, "parent");
        _this.parentWatcher.connect(function (parent) {
            if (_this._parentWatchers)
                _this._parentWatchers.dispose();
            var targetWatcher = parent.targetWatcher, queriedElementsWatcher = parent.queriedElementsWatcher;
            parent.targetWatcher;
            _this._parentWatchers = common_1.DisposableCollection.create(targetWatcher.connect(function (target) { return _this.target = target; }).trigger(), queriedElementsWatcher.connect(_this.reset.bind(_this)));
        });
        return _this;
    }
    ChildElementQuerier.prototype.reset = function () {
        if (!this.parent)
            return this.setQueriedElements([]);
        var filter = this.filter || (function () { return true; });
        var tester = tester_1.getSelectorTester(this.selector, this.parent.target);
        this.setQueriedElements(this.parent.queriedElements.filter(function (element) { return tester.test(element) && filter(element); }));
    };
    ChildElementQuerier.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._parentWatchers)
            this._parentWatchers.dispose();
    };
    return ChildElementQuerier;
}(BaseElementQuerier));
__decorate([
    common_1.bindable()
], ChildElementQuerier.prototype, "parent", void 0);
exports.ChildElementQuerier = ChildElementQuerier;
//# sourceMappingURL=query.js.map