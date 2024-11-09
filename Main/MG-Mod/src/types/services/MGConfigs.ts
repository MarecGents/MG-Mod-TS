import {CommonlLoad} from "../models/external/CommonLoad";
import {ConfigServer} from "@spt/servers/ConfigServer";
import {ModConfig} from "../models/mg/config/IConfig";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";

export class MGConfigs extends CommonlLoad {

    private ConfigServer: ConfigServer;
    private configsJson: object;
    private loadList: LoadList;

    constructor(mod: any, data: ModConfig) {
        super(mod, data);

    }

    public onload(loadList) {
        this.loadList = loadList;
        this.ConfigServer = this.mod.container.resolve<ConfigServer>("ConfigServer");
        this.configsJson = this.ConfigJson.configs;
    }
}