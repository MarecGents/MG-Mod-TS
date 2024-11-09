import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseServer} from "@spt/servers/DatabaseServer";
import {IBots} from "@spt/models/spt/bots/IBots";
import {MGModConfig} from "../models/mg/config/IConfig";
import {LoadList} from "../models/mg/services/ILoadList"
import {IBodyPart} from "@spt/models/eft/common/tables/IBotType";

export class MGBots extends CommonlLoad {

    private bots: IBots;
    private loadList: LoadList;
    private className = "MGBots";

    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList) {
        this.loadList = loadList;
        this.bots = this.mod.container.resolve<DatabaseServer>("DatabaseServer").getTables().bots;
    }

    /**
     * @param rate depend on how much you want bots' health value multiply
     * interface IBodyPart which you can get from SPT/Server Project
     **/
    public c_BotsHeathByRate(rate:number){
        for(let bot in this.bots){
            let bodyPart = this.bots[bot].health.BodyParts[0];
            for(let parts in this.bots[bot].health.BodyParts[0]){
                bodyPart[parts].max *= rate;
                bodyPart[parts].min *= rate;
            }
        }
    }

    /**
     * @param RateData request a Json Object
     * interface IBodyPart which you can get from SPT/Server Project
     **/
    public c_BotsHeathByRealRate(RateData:IBodyPart){
        for(let bot in this.bots){
            let bodyPart = this.bots[bot].health.BodyParts[0];
            for(let parts in this.bots[bot].health.BodyParts[0]){
                bodyPart[parts] = RateData[parts];
            }
        }
    }

}