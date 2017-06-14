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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mesh_1 = require("mesh");
var providers_1 = require("../providers");
var uri_1 = require("../uri");
var synthetic_1 = require("../synthetic");
var aerial_common_1 = require("aerial-common");
var BaseContentEditor = (function () {
    function BaseContentEditor(uri, content) {
        this.uri = uri;
        this.content = content;
    }
    BaseContentEditor.prototype.$didInject = function () {
        this._rootASTNode = this.parseContent(this.content);
    };
    // add uri and content in constructor here instead
    BaseContentEditor.prototype.applyMutations = function (mutations) {
        for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
            var mutation = mutations_1[_i];
            var method = this[mutation.type];
            if (method) {
                var targetASTNode = this.findTargetASTNode(this._rootASTNode, mutation.target);
                if (targetASTNode) {
                    method.call(this, targetASTNode, mutation);
                }
                else {
                    this.logger.error("Cannot apply edit " + mutation.type + " on " + this.uri + ": AST node for synthetic object not found.");
                }
            }
            else {
                this.handleUnknownMutation(mutation);
            }
        }
        return this.getFormattedContent(this._rootASTNode);
    };
    BaseContentEditor.prototype.handleUnknownMutation = function (mutation) {
        this.logger.warn("Cannot apply edit " + mutation.type + " on " + this.uri + ".");
    };
    return BaseContentEditor;
}());
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], BaseContentEditor.prototype, "kernel", void 0);
BaseContentEditor = __decorate([
    aerial_common_1.loggable()
], BaseContentEditor);
exports.BaseContentEditor = BaseContentEditor;
var BaseContentEdit = (function () {
    function BaseContentEdit(target) {
        this.target = target;
        this._mutations = [];
    }
    /**
     * Lock the edit from any new modifications
     */
    BaseContentEdit.prototype.lock = function () {
        this._locked = true;
        return this;
    };
    Object.defineProperty(BaseContentEdit.prototype, "locked", {
        get: function () {
            return this._locked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseContentEdit.prototype, "mutations", {
        get: function () {
            return this._mutations;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Applies all edit.changes against the target synthetic object.
     *
     * @param {(T & IEditable)} target the target to apply the edits to
     */
    BaseContentEdit.prototype.applyMutationsTo = function (target, each) {
        // need to setup an editor here since some events may be intented for
        // children of the target object
        var editor = new SyntheticObjectTreeEditor(target, each);
        editor.applyMutations(this.mutations);
    };
    /**
     * creates a new diff edit -- note that diff edits can only contain diff
     * events since any other event may foo with the diffing.
     *
     * @param {T} newSynthetic
     * @returns
     */
    BaseContentEdit.prototype.fromDiff = function (newSynthetic) {
        var ctor = this.constructor;
        // TODO - shouldn't be instantiating the constructor property (it may require more params). Use clone method
        // instead.
        var clone = new ctor(this.target);
        return clone.addDiff(newSynthetic).lock();
    };
    BaseContentEdit.prototype.addChange = function (mutation) {
        // locked to prevent other events busting this edit.
        if (this._locked) {
            throw new Error("Cannot modify a locked edit.");
        }
        this._mutations.push(mutation);
        // return the event so that it can be edited
        return mutation;
    };
    BaseContentEdit.prototype.addChildEdit = function (edit) {
        (_a = this._mutations).push.apply(_a, edit.mutations);
        return this;
        var _a;
    };
    return BaseContentEdit;
}());
exports.BaseContentEdit = BaseContentEdit;
var FileEditor = (function () {
    function FileEditor() {
    }
    FileEditor.prototype.applyMutations = function (mutations) {
        var _this = this;
        if (this._mutations == null) {
            this._shouldEditAgain = true;
            this._mutations = [];
        }
        (_a = this._mutations).push.apply(_a, mutations);
        if (!!this._promise) {
            this.logger.info("Waiting for previous edit to finish...");
        }
        return this._promise || (this._promise = new Promise(function (resolve, reject) {
            setImmediate(function () {
                var done = function () { return _this._promise = undefined; };
                _this.run().then(resolve, reject).then(done, done);
            });
        }));
        var _a;
    };
    FileEditor.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var changes, mutationsByUri, _i, changes_1, mutation, target, error, targetSource, targetUri, fileMutations, promises, _a, _b, _c, uri, fileCache, _d, type, content, contentEditorFactoryProvider, autoSave, contentEditor, changes_2, newContent, e_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this._shouldEditAgain = false;
                        changes = this._mutations;
                        this._mutations = undefined;
                        mutationsByUri = {};
                        _i = 0, changes_1 = changes;
                        _e.label = 1;
                    case 1:
                        if (!(_i < changes_1.length)) return [3 /*break*/, 4];
                        mutation = changes_1[_i];
                        target = mutation.target;
                        // This may happen if edits are being applied to synthetic objects that
                        // do not have the proper mappings. This WILL happen especially with dynamic javascript. In that
                        // case, we need to short-cert
                        if (!target.source || !target.source.uri) {
                            error = new Error("Cannot edit file, source property is mising from " + target.clone(false).toString() + ".");
                            this.logger.error(error.message);
                            return [2 /*return*/, Promise.reject(error)];
                        }
                        targetSource = target.source;
                        return [4 /*yield*/, providers_1.ProtocolURLResolverProvider.resolve(targetSource.uri, this._kernel)];
                    case 2:
                        targetUri = _e.sent();
                        fileMutations = mutationsByUri[targetUri] || (mutationsByUri[targetUri] = []);
                        fileMutations.push(mutation);
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        promises = [];
                        _a = [];
                        for (_b in mutationsByUri)
                            _a.push(_b);
                        _c = 0;
                        _e.label = 5;
                    case 5:
                        if (!(_c < _a.length)) return [3 /*break*/, 14];
                        uri = _a[_c];
                        return [4 /*yield*/, providers_1.FileCacheProvider.getInstance(this._kernel).findOrInsert(uri)];
                    case 6:
                        fileCache = _e.sent();
                        return [4 /*yield*/, fileCache.read()];
                    case 7:
                        _d = _e.sent(), type = _d.type, content = _d.content;
                        contentEditorFactoryProvider = providers_1.ContentEditorFactoryProvider.find(type, this._kernel);
                        if (!contentEditorFactoryProvider) {
                            this.logger.error("No synthetic edit consumer exists for " + uri + ":" + type + ".");
                            return [3 /*break*/, 13];
                        }
                        autoSave = contentEditorFactoryProvider.autoSave;
                        _e.label = 8;
                    case 8:
                        _e.trys.push([8, 12, , 13]);
                        contentEditor = contentEditorFactoryProvider.create(uri, String(content));
                        changes_2 = mutationsByUri[uri];
                        this.logger.info("Applying file changes " + uri + ": >>", changes_2.map(function (event) { return event.type; }).join(" "));
                        newContent = contentEditor.applyMutations(changes_2);
                        if (!(content !== newContent)) return [3 /*break*/, 10];
                        return [4 /*yield*/, fileCache.setDataUrlContent(newContent)];
                    case 9:
                        _e.sent();
                        promises.push(fileCache.save());
                        if (autoSave) {
                            promises.push(uri_1.URIProtocolProvider.lookup(fileCache.sourceUri, this._kernel).write(fileCache.sourceUri, newContent));
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        this.logger.debug("No changes to " + uri);
                        _e.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_1 = _e.sent();
                        this.logger.error("Error trying to apply " + changes.map(function (event) { return event.type; }).join(", ") + " file edit to " + uri + ": " + e_1.stack);
                        return [3 /*break*/, 13];
                    case 13:
                        _c++;
                        return [3 /*break*/, 5];
                    case 14: return [4 /*yield*/, Promise.all(promises)];
                    case 15:
                        _e.sent();
                        // edits happened during getEditedContent call
                        if (this._shouldEditAgain) {
                            this.run();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return FileEditor;
}());
__decorate([
    aerial_common_1.inject(aerial_common_1.KernelProvider.ID)
], FileEditor.prototype, "_kernel", void 0);
FileEditor = __decorate([
    aerial_common_1.loggable()
], FileEditor);
exports.FileEditor = FileEditor;
var BaseEditor = (function () {
    function BaseEditor(target) {
        this.target = target;
    }
    BaseEditor.prototype.applyMutations = function (mutations) {
        if (mutations.length === 1) {
            this.applySingleMutation(mutations[0]);
        }
        else {
            for (var i = 0, n = mutations.length; i < n; i++) {
                this.applySingleMutation(mutations[i]);
            }
        }
    };
    BaseEditor.prototype.applySingleMutation = function (mutation) { };
    return BaseEditor;
}());
exports.BaseEditor = BaseEditor;
var GroupEditor = (function () {
    function GroupEditor() {
        var editors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            editors[_i] = arguments[_i];
        }
        this.editors = editors;
    }
    GroupEditor.prototype.applyMutations = function (mutations) {
        for (var i = 0, n = this.editors.length; i < n; i++) {
            this.editors[i].applyMutations(mutations);
        }
    };
    return GroupEditor;
}());
exports.GroupEditor = GroupEditor;
var SyntheticObjectTreeEditor = (function () {
    function SyntheticObjectTreeEditor(root, _each) {
        this.root = root;
        this._each = _each;
    }
    SyntheticObjectTreeEditor.prototype.applyMutations = function (mutations) {
        var allSyntheticObjects = {};
        aerial_common_1.flattenTree(this.root).forEach(function (child) {
            allSyntheticObjects[child.uid] = child;
        });
        for (var i = 0, n = mutations.length; i < n; i++) {
            var mutation = mutations[i];
            // Assuming that all edit.changes being applied to synthetics are editable. Otherwise
            // they shouldn't be dispatched.
            var target = allSyntheticObjects[mutation.target.uid];
            if (!target) {
                console.error(new Error("Edit change " + mutation.type + " target " + mutation.target.uid + " not found."));
                continue;
            }
            try {
                target.createEditor().applyMutations([mutation]);
                // each is useful particularly for debugging diff algorithms. See tests.
                if (this._each)
                    this._each(target, mutation);
            }
            catch (e) {
                throw new Error("Error trying to apply edit " + mutation.type + " to " + mutation.target.toString() + ": " + e.stack);
            }
        }
    };
    return SyntheticObjectTreeEditor;
}());
exports.SyntheticObjectTreeEditor = SyntheticObjectTreeEditor;
/**
 * Watches synthetic objects, and emits changes over time.
 */
var SyntheticObjectChangeWatcher = (function () {
    function SyntheticObjectChangeWatcher(onChange, onClone, filterMessage) {
        this.onChange = onChange;
        this.onClone = onClone;
        this.filterMessage = filterMessage;
        this._targetObserver = new mesh_1.CallbackBus(this.onTargetEvent.bind(this));
        if (!this.filterMessage) {
            this.filterMessage = function (event) { return !!event.mutation; };
        }
    }
    Object.defineProperty(SyntheticObjectChangeWatcher.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (value) {
            this.dispose();
            this._target = value;
            if (!this._clone) {
                this._clone = value.clone(true);
                this.onClone(this._clone);
            }
            else {
                this.diff();
            }
            if (this._target) {
                this._target.observe(this._targetObserver);
            }
        },
        enumerable: true,
        configurable: true
    });
    SyntheticObjectChangeWatcher.prototype.dispose = function () {
        if (this._target) {
            this._target.unobserve(this._targetObserver);
        }
    };
    SyntheticObjectChangeWatcher.prototype.onTargetEvent = function (event) {
        if (!this.filterMessage || this.filterMessage(event)) {
            // debounce to batch multiple operations together
            this.requestDiff();
        }
    };
    SyntheticObjectChangeWatcher.prototype.requestDiff = function () {
        if (this._ticking)
            return;
        this._ticking = true;
        setImmediate(this.diff.bind(this));
    };
    SyntheticObjectChangeWatcher.prototype.diff = function () {
        return __awaiter(this, void 0, void 0, function () {
            var edit, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._ticking = false;
                        if (this._diffing) {
                            this._shouldDiffAgain = true;
                            return [2 /*return*/];
                        }
                        this._diffing = true;
                        edit = this._clone.createEdit().fromDiff(this._target);
                        if (!edit.mutations.length) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.onChange(edit.mutations)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        this._diffing = false;
                        throw e_2;
                    case 4:
                        edit.applyMutationsTo(this._clone);
                        _a.label = 5;
                    case 5:
                        this._diffing = false;
                        if (this._shouldDiffAgain) {
                            this._shouldDiffAgain = false;
                            this.diff();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return SyntheticObjectChangeWatcher;
}());
exports.SyntheticObjectChangeWatcher = SyntheticObjectChangeWatcher;
var SyntheticObjectChangeTypes;
(function (SyntheticObjectChangeTypes) {
    SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT = "setSyntheticSourceEdit";
})(SyntheticObjectChangeTypes = exports.SyntheticObjectChangeTypes || (exports.SyntheticObjectChangeTypes = {}));
var SyntheticObjectEditor = (function (_super) {
    __extends(SyntheticObjectEditor, _super);
    function SyntheticObjectEditor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticObjectEditor.prototype.applySingleMutation = function (mutation) {
        if (mutation.type === SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT) {
            this.target.$source = mutation.newValue;
        }
    };
    return SyntheticObjectEditor;
}(BaseEditor));
exports.SyntheticObjectEditor = SyntheticObjectEditor;
var SyntheticObjectEdit = (function (_super) {
    __extends(SyntheticObjectEdit, _super);
    function SyntheticObjectEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyntheticObjectEdit.prototype.setSource = function (source) {
        this.addChange(new aerial_common_1.PropertyMutation(SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, this.target, "$source", source));
    };
    SyntheticObjectEdit.prototype.addDiff = function (from) {
        if (!synthetic_1.syntheticSourceInfoEquals(this.target.$source, from.$source)) {
            this.setSource(from.$source);
        }
        return this;
    };
    return SyntheticObjectEdit;
}(BaseContentEdit));
exports.SyntheticObjectEdit = SyntheticObjectEdit;
//# sourceMappingURL=index.js.map