import {MGBots} from "./servers/MGBots";
import {MGConfigs} from "./servers/MGConfigs";
import {MGGlobals} from "./servers/MGGlobals";
import {MGHideout} from "./servers/MGHideout";
import {MGLocales} from "./servers/MGLocales";
import {MGTemplates} from "./servers/MGTemplates";
import {MGTraders} from "./servers/MGTraders";
import {OutputService} from "./services/OutputService";
import {MGLocations} from "./servers/MGLocations";
import {Mod} from "../mod";
import {MGTest} from "./servers/MGTest";

export class loadMod {

    public mod:Mod;
    public MGBots:MGBots;
    public MGConfigs:MGConfigs;
    public MGGlobals:MGGlobals;
    public MGHideout:MGHideout;
    public MGLocales:MGLocales;
    public MGLocations:MGLocations;
    public MGTemplates:MGTemplates;
    public MGTraders:MGTraders;
    public MGTest:MGTest;
    public Output:OutputService;

    public load(mod:Mod):loadMod {
        this.mod = mod;
        this.MGBots = new MGBots(this.mod,this);
        this.MGConfigs = new MGConfigs(this.mod,this);
        this.MGGlobals = new MGGlobals(this.mod,this);
        this.MGHideout = new MGHideout(this.mod,this);
        this.MGLocales = new MGLocales(this.mod,this);
        this.MGLocations = new MGLocations(this.mod,this);
        this.MGTemplates = new MGTemplates(this.mod,this);
        this.MGTraders = new MGTraders(this.mod,this);
        this.MGTest = new MGTest(this.mod, this);
        this.Output = new OutputService(this.mod.Logger)
        return this;
    }
}