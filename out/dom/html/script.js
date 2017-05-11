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
Object.defineProperty(exports, "__esModule", { value: true });
var element_1 = require("./element");
var sandbox_1 = require("@tandem/sandbox");
var SyntheticHTMLScriptElement = (function (_super) {
    __extends(SyntheticHTMLScriptElement, _super);
    function SyntheticHTMLScriptElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SyntheticHTMLScriptElement.prototype, "src", {
        get: function () {
            return this.getAttribute("src");
        },
        set: function (value) {
            this.setAttribute("src", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyntheticHTMLScriptElement.prototype, "text", {
        get: function () {
            return this.textContent;
        },
        set: function (value) {
            this.textContent = value;
            this.executeScript();
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHTMLScriptElement.prototype.attachedCallback = function () {
        this.executeScript();
    };
    Object.defineProperty(SyntheticHTMLScriptElement.prototype, "type", {
        get: function () {
            return this.getAttribute("type");
        },
        enumerable: true,
        configurable: true
    });
    SyntheticHTMLScriptElement.prototype.executeScript = function () {
        if (this._executed || !this._attached)
            return;
        var src = this.getAttribute("src");
        var type = this.getAttribute("type");
        if (type && (type !== "text/javascript" && type !== "application/javascript"))
            return;
        var module = this.$module;
        var sandox = this.ownerDocument.sandbox;
        var window = this.ownerDocument.defaultView;
        var source = this.$source;
        var content = src ? module && module.source.eagerGetDependency(src).content : this.textContent;
        if (!content)
            return;
        this._executed = true;
        try {
            var uri = src || source && source.uri || window.location.toString();
            // node that $module will only exist if the script is evaluated from an HTML file
            // TODO - this doesn't work.. need 
            var script = sandbox_1.compileGlobalSandboxScript(uri, uri, content);
            sandbox_1.runGlobalSandboxScript(script, sandox);
        }
        catch (e) {
            console.error(e.stack);
        }
    };
    return SyntheticHTMLScriptElement;
}(element_1.SyntheticHTMLElement));
exports.SyntheticHTMLScriptElement = SyntheticHTMLScriptElement;
//# sourceMappingURL=script.js.map