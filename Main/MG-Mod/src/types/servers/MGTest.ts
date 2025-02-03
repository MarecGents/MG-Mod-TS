import {CommonlLoadTest} from "../models/external/CommonLoadTest";
import {Mod} from "../../mod";
import {DatabaseService} from "@spt/services/DatabaseService";
import {ITemplateItem} from "../../../types/models/eft/common/tables/ITemplateItem";
import {loadMod} from "../loadMod";

export class MGTest{


    private mod:Mod;
    private className:string;
    private MGLoad:loadMod;
    private databaseServices:DatabaseService;

    constructor(mod:Mod, MGLoad:loadMod) {
        this.mod = mod;
        this.className = "MGTest";
        this.MGLoad = MGLoad;
        this.databaseServices = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public getItems():Record<string, ITemplateItem> {
        return this.databaseServices.getItems();
    }

    public outputTest():void {
        this.MGLoad.Output.debugLog("abcdef");
    }
}