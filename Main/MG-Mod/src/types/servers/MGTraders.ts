import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {ITrader, ITraderAssort} from "@spt/models/eft/common/tables/ITrader";
import {LoadList} from "../models/mg/services/ILoadList";
import {CustomTraderAssort} from "../models/mg/traders/ITraderCustom";
import {HashUtil} from "@spt/utils/HashUtil";
import {Mod} from "../../mod";
import {IItem} from "@spt/models/eft/common/tables/IItem";
import {MGItems} from "../models/mg/items/EItems";
import {IClone} from "../utils/IClone";
import {IFormatUtils} from "../utils/IFormatUtils";


export class MGTraders extends CommonlLoad {

    protected databaseService: DatabaseService;
    protected loadList: LoadList;

    constructor(mod: Mod) {
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
        }
    }

    public getTraders(): Record<string, ITrader> {
        return this.databaseService.getTraders();
    }

    public getTrader(traderId: string): ITrader {
        return this.databaseService.getTrader(traderId);
    }

    public creatCustomItemAssort(MGItem: MGItems, traderId: string): CustomTraderAssort {
        const customAssort: CustomTraderAssort = {
            assort: [],
            currency: MGItem.currency,
            loyal_level_items: MGItem.loyal_level,
            price: MGItem.price,
            traderId: traderId,
        }
        if (MGItem.assort.length > 0) {
            customAssort.assort = this.fixAssort(MGItem.assort);
        } else {
            const assort: IItem[] = [{
                _id: "uniqueId",
                _tpl: MGItem.items.newId,
                parentId: 'hideout',
                slotId: 'hideout',
                upd: {
                    UnlimitedCount: true,
                    StackObjectsCount: 999999
                }
            }];
            customAssort.assort = this.fixAssort(assort);
        }
        return customAssort;
    }

    public addAssortToTrader(customAssort: CustomTraderAssort): void {
        const TraderAssort: ITraderAssort = this.getTrader(customAssort.traderId).assort;
        TraderAssort.items.push(...customAssort.assort);
        const mainAssort: IItem = (customAssort.assort).find((x: IItem): boolean => (x.slotId == 'hideout' && x.parentId == 'hideout'));
        const rID = mainAssort._id;
        TraderAssort.barter_scheme[rID] = [[{
            count: customAssort.price,
            _tpl: customAssort.currency
        }]]
        TraderAssort.loyal_level_items[rID] = customAssort.loyal_level_items;
    }

    public addCustomTrader(traderId: string, traderData: ITrader): void {
        let Traders: Record<string, ITrader> = this.getTraders();
        Traders[traderId] = traderData;
    }

    public fixAssort(assorts: IItem[]): IItem[] {
        let newAssorts: IItem[] = (new IClone(this.mod)).clone(assorts);
        for (let assort of assorts) {
            let oldId: string = assort._id
            assort._id = (new HashUtil()).generate();
            newAssorts = (new IFormatUtils()).replaceKey(newAssorts, oldId, assort._id);
        }
        return newAssorts;
    }


}