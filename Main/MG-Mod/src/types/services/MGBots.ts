import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseServer} from "@spt/servers/DatabaseServer";
import {IBots} from "@spt/models/spt/bots/IBots";
import {ModConfig} from "../models/mg/config/IConfig";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";

export class MGBots extends CommonlLoad{

    private bots: IBots;
    private botJson: object;
    
    constructor(mod,data:ModConfig) {
        super(mod,data)
    }

    public onload<T>(): T {
        this.bots = this.mod.container.resolve<DatabaseServer>("DatabaseServer").getTables().bots;
        this.botJson = this.ConfigJson.bots;
        this.init();
        return;
    }
    public init<T>(): T {
        if(this.botJson){
            this.mod.Logger.log("MGBots loaded",LogTextColor.YELLOW);
        }
        return;
    }

}