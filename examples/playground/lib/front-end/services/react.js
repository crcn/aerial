"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import React from "react";
// import ReactDOM from "react-dom";
const base_1 = require("./base");
const lodash_1 = require("lodash");
const RENDER_MS = 1000 / 35;
class ReactService extends base_1.BaseFrontEndService {
    constructor() {
        super(...arguments);
        this.render = lodash_1.throttle(() => {
            console.log('RENDER');
        }, RENDER_MS);
    }
    dispatch(message) {
        this.render();
    }
    testMessage() {
        return true;
    }
}
exports.ReactService = ReactService;
//# sourceMappingURL=react.js.map