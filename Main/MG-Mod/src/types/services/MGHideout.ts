import {CommonlLoad} from "../models/external/CommonLoad";
import {ModConfig} from "../models/mg/config/IConfig";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";

export class MGHideout extends CommonlLoad {

    private hideout: object;
    private loadList: LoadList;

    constructor(mod: any, data: ModConfig) {
        super(mod, data);

    }

    public onload(loadList){
        this.loadList = loadList;
        this.hideout = this.mod.container.resolve<DatabaseService>("DatabaseService").getHideout();
        this.init();
        this.mod.Logger.log("MGHideout loaded Successed", LogTextColor.YELLOW);
    }

    public init() {
        if (this.hideout) {
            this.mod.Logger.log("MGHideout initialed", LogTextColor.YELLOW);
        }
        return;
    }
}