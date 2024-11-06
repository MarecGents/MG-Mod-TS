"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IClone_1 = require("./types/utils/IClone");
class Mod {
    container;
    Logger;
    VFS;
    modpath;
    preSptLoad(container) {
        this.container = container;
        this.Logger = container.resolve("WinstonLogger");
        this.VFS = container.resolve("VFS");
        const PreSptModLoader = container.resolve('PreSptModLoader');
        this.modpath = PreSptModLoader.getModPath("MG-Mod-New");
    }
    postDBLoad(container) {
        // const iconle = new IClone(this)
        const a = {
            "a": 1,
            "b": 1,
        };
        this.Logger.log((new IClone_1.IClone(this)).clone(a), 'red');
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map