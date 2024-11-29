import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {ITrader} from "@spt/models/eft/common/tables/ITrader";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";

export class MGTraders extends CommonlLoad {

    private databaseService: DatabaseService;
    protected loadList: LoadList;
    private className = "MGTraders";
    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList?: LoadList) {
        this.loadList = loadList;
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public getTraders(): Record<string, ITrader> {
        return this.databaseService.getTraders();
    }

    public getTrader(traderId: string): ITrader{
        return this.databaseService.getTrader(traderId);
    }

}