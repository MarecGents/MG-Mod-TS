import { CommonlLoad } from "../models/external/CommonLoad";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ITrader } from "@spt/models/eft/common/tables/ITrader";
import { LoadList } from "../models/mg/services/ILoadList";

export class MGTraders extends CommonlLoad {

    protected databaseService: DatabaseService;
    protected loadList: LoadList;
    protected className = "MGTraders";

    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
            this.valueHelper = this.loadList.ValueHelper;
        }
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public getTraders(): Record<string, ITrader> {
        return this.databaseService.getTraders();
    }

    public getTrader(traderId: string): ITrader {
        return this.databaseService.getTrader(traderId);
    }

}