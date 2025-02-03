import { CommonlLoad } from "../models/external/CommonLoad";
import { ILocations } from "@spt/models/spt/server/ILocations";
import { LoadList } from "../models/mg/services/ILoadList";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ILocation } from "@spt/models/eft/common/ILocation";
import {Mod} from "../../mod";
import {loadMod} from "../loadMod";

export class MGLocations{

    private mod:Mod
    private className:string;
    private MGLoad:loadMod;
    private databaseService: DatabaseService;

    constructor(mod: Mod, MGLoad:loadMod) {
        this.mod = mod;
        this.className = "MGLocales";
        this.MGLoad = MGLoad;
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public getLocations(): ILocations {
        return this.databaseService.getLocations();
    }

    public getLocation(locationId: string): ILocation {
        return this.databaseService.getLocation(locationId);
    }


}