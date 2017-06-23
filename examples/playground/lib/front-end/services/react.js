"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReactDOM = require("react-dom");
const base_1 = require("./base");
const lodash_1 = require("lodash");
const providers_1 = require("../providers");
const RENDER_MS = 1000 / 35;
class ReactService extends base_1.BaseFrontEndService {
    constructor() {
        super(...arguments);
        this.render = lodash_1.throttle(() => {
            ReactDOM.render(providers_1.RootComponentProvider.create({
                kernel: this.kernel
            }, this.kernel), this.config.element);
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