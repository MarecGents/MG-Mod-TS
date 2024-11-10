import {CommonlLoad} from "../models/external/CommonLoad";
import {ITemplates} from "@spt/models/spt/templates/ITemplates";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";

export class MGTemplates extends CommonlLoad {
    private templetes: ITemplates;

    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList) {
        this.loadList = loadList;
        this.templetes = this.mod.container.resolve<DatabaseService>("DatabaseService").getTemplates();
    }


}