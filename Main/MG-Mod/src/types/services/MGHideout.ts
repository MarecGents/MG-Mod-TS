import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";

export class MGHideout extends CommonlLoad {

    private hideout: object;
    private loadList: LoadList;

    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList) {
        this.loadList = loadList;
        this.hideout = this.mod.container.resolve<DatabaseService>("DatabaseService").getHideout();
    }
}