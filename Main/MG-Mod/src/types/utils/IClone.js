"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IClone = void 0;
class IClone {
    mod;
    constructor(mod) {
        this.mod = mod;
    }
    clone(value) {
        const JmporterUtil = this.mod.container.resolve("ImporterUtil");
        const JsonUtil = this.mod.container.resolve('JsonUtil');
        if (typeof (value) === "object" && value !== null) {
            return JsonUtil.clone(value);
        }
        else if (typeof value === "string") {
            return JsonUtil.clone(JmporterUtil.loadRecursive(value));
        }
    }
}
exports.IClone = IClone;
.0;
//# sourceMappingURL=IClone.js.map