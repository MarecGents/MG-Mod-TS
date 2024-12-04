import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {ITrader} from "@spt/models/eft/common/tables/ITrader";
import {LoadList} from "../models/mg/services/ILoadList";
import {CustomAssort} from "../models/mg/traders/ITraderCustom";
import {HashUtil} from "@spt/utils/HashUtil";
import {IFormatUtils} from "../utils/IFormatUtils";

export class MGTraders extends CommonlLoad {

    protected databaseService: DatabaseService;
    protected loadList: LoadList;

    constructor(mod: any) {
        super(mod);
    }

    public init() {
        this.className = "MGTraders";
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
            this.valueHelper = this.loadList.ValueHelper;
        }
    }

    public getTraders(): Record<string, ITrader> {
        return this.databaseService.getTraders();
    }

    public getTrader(traderId: string): ITrader {
        return this.databaseService.getTrader(traderId);
    }

    public addMGItemAssort(traderId: string, assortInfo: CustomAssort) {
        let TraderAssort = this.getTrader(traderId).assort;
        let assorts = assortInfo.assort;
        // 原则上完全相信外部传进来的参数的数据格式的正确性
        // if(!((new IFormatUtils()).assortIdIssue(assorts))){
        //     this.output.error(`存在独立物品assort数据格式错误！`);
        //     return;
        // }
        let randId = (new HashUtil()).generate()
        assorts.forEach(assort => {
            if(assort.parentId === "hideout" && assort.slotId === "hideout"){
                randId = assort._id;
            }
            TraderAssort.items.push(assort);
        })
        TraderAssort.barter_scheme[randId]=[[{
            "count":assortInfo.price,
            "_tpl":assortInfo.currency
        }]]
        TraderAssort.loyal_level_items[randId]=assortInfo.loyal_level_items;
        return;
    }

    public addCustomTrader(trader: ITrader) {

    }


}