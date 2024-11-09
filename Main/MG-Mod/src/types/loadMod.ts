import {IClone} from "./utils/IClone";
import {PathTypes} from "./models/enums/PathTypes";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LogBackgroundColor} from "@spt/models/spt/logging/LogBackgroundColor";
import {Test} from "./test/test";
import {MGBots} from "./services/MGBots";
import {MGConfigs} from "./services/MGConfigs";
import {MGGlobals} from "./services/MGGlobals";
import {MGHideout} from "./services/MGHideout";
import {MGLocales} from "./services/MGLocales";
import {MGTemplates} from "./services/MGTemplates";
import {MGTraders} from "./services/MGTraders";
import {ModConfig} from "./models/mg/config/IConfig";
import {LoadList} from "./models/mg/services/ILoadList";
import {FormatOutput} from "./servers/FormatOutput";

export class loadMod {

    protected mod;
    public loadList: LoadList;

    constructor(mod) {
        this.mod = mod;
    }

    load() {
        const ConfigJson: ModConfig = new IClone(this.mod).clone(this.mod.modpath + PathTypes.ModConfigList).config;
        // (new Test(this.mod,ConfigJson));
        this.loadList = {
            MGList: {
                MGlocales: (new MGLocales(this.mod, ConfigJson)),
                MGbots: (new MGBots(this.mod, ConfigJson)),
                MGconfigs: (new MGConfigs(this.mod, ConfigJson)),
                MGglobals: (new MGGlobals(this.mod, ConfigJson)),
                MGhideout: (new MGHideout(this.mod, ConfigJson)),
                MGtraders: (new MGTraders(this.mod, ConfigJson)),
                MGtemplates: (new MGTemplates(this.mod, ConfigJson)),
            },
            Output: (new FormatOutput(this.mod.Logger))
        };
        for (const service in this.loadList.MGList) {
            this.loadList.MGList[service].onload(this.loadList);
        }
        return this.loadList;
    }
}