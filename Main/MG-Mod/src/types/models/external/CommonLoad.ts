import {ModConfig} from "../mg/config/IConfig";
import {LoadList} from "../mg/services/ILoadList";

export class CommonlLoad {

    private mod: any;
    private ConfigJson: ModConfig;
    constructor(mod: any, data: ModConfig) {
        this.mod = mod;
        this.ConfigJson = data;
    }

    public onload(loadList?: LoadList) {

    }

    public init() {

    }
}