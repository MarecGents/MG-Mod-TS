import {CommonlLoad} from "../models/external/CommonLoad";
import {ModConfig} from "../models/mg/config/IConfig";
import {DatabaseService} from "@spt/services/DatabaseService";
import {IGlobals} from "@spt/models/eft/common/IGlobals";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";

export class MGGlobals extends CommonlLoad {
    private globals: IGlobals;
    private loadList: LoadList;

    constructor(mod: any, data: ModConfig) {
        super(mod, data);

    }

    public onload(loadList){
        this.loadList = loadList;
        this.globals = this.mod.container.resolve<DatabaseService>("DatabaseService").getGlobals();
        this.init();
        this.mod.Logger.log("MGGlobals loaded Successed", LogTextColor.YELLOW)
    }

    public init() {
        if (this.globals) {
            this.mod.Logger.log("MGGlobals initialed", LogTextColor.YELLOW)
        }
        return;
    }
}