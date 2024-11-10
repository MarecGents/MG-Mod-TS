import {IClone} from "./utils/IClone";
import {PathTypes} from "./models/enums/PathTypes";
import {Test} from "./test/test";
import {MGBots} from "./services/MGBots";
import {MGConfigs} from "./services/MGConfigs";
import {MGGlobals} from "./services/MGGlobals";
import {MGHideout} from "./services/MGHideout";
import {MGLocales} from "./services/MGLocales";
import {MGTemplates} from "./services/MGTemplates";
import {MGTraders} from "./services/MGTraders";
import {MGModConfig} from "./models/mg/config/IConfig";
import {LoadList} from "./models/mg/services/ILoadList";
import {FormatOutput} from "./servers/FormatOutput";
import {ValueHepler} from "./helpers/ValueHepler";

export class loadMod {

    protected mod;
    public loadList: LoadList;

    constructor(mod) {
        this.mod = mod;
    }

    load() {
        const ConfigJson: MGModConfig = new IClone(this.mod).clone(this.mod.modpath + PathTypes.ModConfigList).config;
        // (new Test(this.mod,ConfigJson));
        this.loadList = {
            MGList: {
                MGlocales: (new MGLocales(this.mod)),
                MGbots: (new MGBots(this.mod)),
                MGconfigs: (new MGConfigs(this.mod)),
                MGglobals: (new MGGlobals(this.mod)),
                MGhideout: (new MGHideout(this.mod)),
                MGtraders: (new MGTraders(this.mod)),
                MGtemplates: (new MGTemplates(this.mod)),
            },
            Output: (new FormatOutput(this.mod.Logger)),
            ValueHelper:(new ValueHepler())
        };
        for (const service in this.loadList.MGList) {
            this.loadList.MGList[service].onload(this.loadList);
        }
        return this.loadList;
    }
}