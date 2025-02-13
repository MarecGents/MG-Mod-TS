import {Mod} from "../../mod";
import {loadMod} from "../loadMod";
import {ILooseLoot} from "../models/mg/location/ILooseLoot";
import {ILocations} from "@spt/models/spt/server/ILocations";
import {ILocation} from "@spt/models/eft/common/ILocation";

export class ItemsSpawnService {

    private mod:Mod;
    private MGLoad:loadMod;

    constructor(mod:Mod, MGLoad:loadMod) {
        this.mod = mod;
        this.MGLoad = MGLoad;
    }

    public start(looseLoot:Record<string, ILooseLoot>):void {
        const Locations:ILocations = this.MGLoad.MGLocations.getLocations();
        Object.keys(looseLoot).forEach((location:string):void=>{
            this.addLooseLoot(Locations[location],looseLoot[location]);
        });
    }

    private addLooseLoot(Location:ILocation,looseLoot:ILooseLoot):void{
        if("spawnpoints" in looseLoot){
            Location.looseLoot.spawnpoints.push(...looseLoot.spawnpoints);
        }
        if("spawnpointCount" in looseLoot){
            Location.looseLoot.spawnpointCount.push(...looseLoot.spawnpointCount);
        }
        if("spawnpointsForced" in looseLoot){
            Location.looseLoot.spawnpointsForced.push(...looseLoot.spawnpointsForced);
        }
    }

}