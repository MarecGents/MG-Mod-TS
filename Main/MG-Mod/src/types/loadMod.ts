import {IClone} from "./utils/IClone";
import {PathTypes} from "./models/enums/PathTypes";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LogBackgroundColor} from "@spt/models/spt/logging/LogBackgroundColor";
import {Locales} from "./services/locales";
import {Test} from "./test/test";

export class loadMod{

    protected mod;
    constructor(mod) {
        this.mod = mod;
    }

    load(){
        const ConfigJson = new IClone(this.mod).clone(this.mod.modpath + PathTypes.ModConfigList).config;
        (new Locales(this.mod,ConfigJson));
    }
}