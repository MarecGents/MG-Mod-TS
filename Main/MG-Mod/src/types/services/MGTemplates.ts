import {CommonlLoad} from "../models/external/CommonLoad";
import {ModConfig} from "../models/mg/config/IConfig";
import {ITemplates} from "@spt/models/spt/templates/ITemplates";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";

export class MGTemplates extends CommonlLoad {
    private templetes: ITemplates;
    private loadList: LoadList;

    constructor(mod: any, data: ModConfig) {
        super(mod, data);

    }

    public onload(loadList) {
        this.loadList = loadList;
        this.templetes = this.mod.container.resolve<DatabaseService>("DatabaseService").getTemplates();
    }


}