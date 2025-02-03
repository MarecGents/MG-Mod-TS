import {DatabaseService} from "@spt/services/DatabaseService";
import {IBots} from "@spt/models/spt/bots/IBots";
import {IBodyPart} from "@spt/models/eft/common/tables/IBotType";
import {Mod} from "../../mod";
import {loadMod} from "../loadMod";

export class MGBots {

    private mod:Mod;
    private className:string;
    private MGLoad:loadMod;
    private databaseService: DatabaseService;
    constructor(mod: Mod, MGLoad:loadMod) {
        this.mod = mod;
        this.className = "MGBots";
        this.MGLoad = MGLoad;
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public getBots():IBots{
        return this.databaseService.getBots();
    }

    /**
     * @param rate depend on how much you want bots' health value multiply
     * interface IBodyPart which you can get from SPT/Server Project
     **/
    public c_BotsHeathByRate(rate:number):void {
        let bots:IBots = this.getBots();
        for(let bot in bots.types){
            let bodyPart:IBodyPart = bots.types[bot].health.BodyParts[0];
            for(let parts in bots.types[bot].health.BodyParts[0]){
                bodyPart[parts].max *= rate;
                bodyPart[parts].min *= rate;
            }
        }
    }

    /**
     * @param RateData request a Json Object
     * interface IBodyPart which you can get from SPT/Server Project
     **/
    public c_BotsHeathByRealRate(RateData:IBodyPart):void {
        let bots:IBots = this.getBots();
        for(let bot in bots.types){
            let bodyPart:IBodyPart = bots[bot].health.BodyParts[0];
            for(let parts in bots[bot].health.BodyParts[0]){
                bodyPart[parts] = RateData[parts];
            }
        }
    }

}