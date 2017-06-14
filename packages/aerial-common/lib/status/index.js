"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var serialize_1 = require("../serialize");
var Status = Status_1 = (function () {
    function Status(type, data) {
        this.type = type;
        this.data = data;
    }
    Status.prototype.clone = function () {
        return new Status_1(this.type, this.data);
    };
    return Status;
}());
Status.IDLE = "idle";
Status.ERROR = "error";
Status.LOADING = "loading";
Status.COMPLETED = "completed";
Status = Status_1 = __decorate([
    serialize_1.serializable("Status", {
        serialize: function (_a) {
            var type = _a.type, data = _a.data;
            return { type: type, data: serialize_1.serialize(data) };
        },
        deserialize: function (_a, kernel) {
            var type = _a.type, data = _a.data;
            return new Status_1(type, serialize_1.deserialize(data, kernel));
        }
    })
], Status);
exports.Status = Status;
var Status_1;
//# sourceMappingURL=index.js.map