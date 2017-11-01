"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var haveWarned = Object.create({});
function warnOnceInDevelopment(msg, type) {
    if (type === void 0) { type = 'warn'; }
    if (environment_1.isProduction()) {
        return;
    }
    if (!haveWarned[msg]) {
        if (!environment_1.isTest()) {
            haveWarned[msg] = true;
        }
        switch (type) {
            case 'error':
                console.error(msg);
                break;
            default:
                console.warn(msg);
        }
    }
}
exports.warnOnceInDevelopment = warnOnceInDevelopment;
//# sourceMappingURL=warnOnce.js.map