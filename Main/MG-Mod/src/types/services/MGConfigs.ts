import {CommonlLoad} from "../models/external/CommonLoad";
import {ConfigServer} from "@spt/servers/ConfigServer";
import {ModConfig} from "../models/mg/config/IConfig";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";

export class MGConfigs extends CommonlLoad {

    private ConfigServer:ConfigServer;
    private configsJson: object;

    constructor(mod: any, data: ModConfig) {
        super(mod,data)
    }

    onload<T>(): T {
        this.ConfigServer = this.mod.container.resolve<ConfigServer>("ConfigServer");
        this.configsJson = this.ConfigJson.configs;
        this.init();
        return;
    }

    init<T>(): T {
        if(this.ConfigServer){
            this.mod.Logger.log("MGConfigs loaded",LogTextColor.YELLOW)
        }
        return;
    }
}