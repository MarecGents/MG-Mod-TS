import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {IBots} from "@spt/models/spt/bots/IBots";
import {LoadList} from "../models/mg/services/ILoadList"
import {IBodyPart} from "@spt/models/eft/common/tables/IBotType";

export class MGBots extends CommonlLoad {

    protected bots: IBots;
    protected loadList: LoadList;
    protected databaseService: DatabaseService;

    constructor(mod: any) {
        super(mod);
    }

    public init(){
        this.className = "MGBots";
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
        this.bots = this.databaseService.getBots();
    }

    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
            this.valueHelper = this.loadList.ValueHelper;
        }
    }

    public getBots():IBots{
        return this.bots;
    }

    /**
     * @param rate depend on how much you want bots' health value multiply
     * interface IBodyPart which you can get from SPT/Server Project
     **/
    public c_BotsHeathByRate(rate:number){
        for(let bot in this.bots.types){
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
        for(let bot in this.bots.types){
            let bodyPart = this.bots[bot].health.BodyParts[0];
            for(let parts in this.bots[bot].health.BodyParts[0]){
                bodyPart[parts] = RateData[parts];
            }
        }
    }

}