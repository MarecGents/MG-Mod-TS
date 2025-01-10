import {MGBots} from "./servers/MGBots";
import {MGConfigs} from "./servers/MGConfigs";
import {MGGlobals} from "./servers/MGGlobals";
import {MGHideout} from "./servers/MGHideout";
import {MGLocales} from "./servers/MGLocales";
import {MGTemplates} from "./servers/MGTemplates";
import {MGTraders} from "./servers/MGTraders";
import {LoadList} from "./models/mg/services/ILoadList";
import {FormatOutput} from "./services/FormatOutput";
import {ValueHepler} from "./helpers/ValueHepler";
import {MGLocations} from "./servers/MGLocations";
import {Mod} from "../mod";

export class loadMod {

    protected mod:Mod;
    public loadList: LoadList;

    constructor(mod) {
        this.mod = mod;
    }

    load() {
        this.loadList = {
            MGList: {
                MGlocales: (new MGLocales(this.mod)),
                MGbots: (new MGBots(this.mod)),
                MGconfigs: (new MGConfigs(this.mod)),
                MGglobals: (new MGGlobals(this.mod)),
                MGhideout: (new MGHideout(this.mod)),
                MGtraders: (new MGTraders(this.mod)),
                MGtemplates: (new MGTemplates(this.mod)),
                MGLocations: (new MGLocations(this.mod)),
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