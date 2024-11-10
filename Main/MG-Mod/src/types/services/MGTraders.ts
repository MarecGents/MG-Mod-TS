import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {ITrader} from "@spt/models/eft/common/tables/ITrader";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";

export class MGTraders extends CommonlLoad {
    private traders: Record<string, ITrader>;

    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList) {
        this.loadList = loadList;
        this.traders = this.mod.container.resolve<DatabaseService>("DatabaseService").getTraders();
    }
}