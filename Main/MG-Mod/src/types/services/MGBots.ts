import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseServer} from "@spt/servers/DatabaseServer";
import {IBots} from "@spt/models/spt/bots/IBots";
import {ModConfig} from "../models/mg/config/IConfig";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList"
import {FormatOutput} from "../servers/FormatOutput";

export class MGBots extends CommonlLoad {

    private bots: IBots;
    private botJson: object;
    private loadList: LoadList;
    private className="MGBots";
    constructor(mod: any, data: ModConfig) {
        super(mod, data);
    }

    public onload(loadList){
        this.loadList = loadList;
        this.bots = this.mod.container.resolve<DatabaseServer>("DatabaseServer").getTables().bots;
        this.botJson = this.ConfigJson.bots;
        this.init();
        this.loadList.Output.classLoaded(this.className);
    }

    public init() {
        if (this.bots) {
            this.mod.Logger.log(`${this.className} initialed`, LogTextColor.YELLOW);
        }
    }

}