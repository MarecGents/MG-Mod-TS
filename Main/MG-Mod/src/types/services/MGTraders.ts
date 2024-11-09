import {CommonlLoad} from "../models/external/CommonLoad";
import {ModConfig} from "../models/mg/config/IConfig";
import {DatabaseService} from "@spt/services/DatabaseService";
import {ITrader} from "@spt/models/eft/common/tables/ITrader";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";

export class MGTraders extends CommonlLoad {
    private traders: Record<string, ITrader>;
    private loadList: LoadList;

    constructor(mod: any, data: ModConfig) {
        super(mod, data);

    }

    public onload(loadList) {
        this.loadList = loadList;
        this.traders = this.mod.container.resolve<DatabaseService>("DatabaseService").getTraders();
    }
}