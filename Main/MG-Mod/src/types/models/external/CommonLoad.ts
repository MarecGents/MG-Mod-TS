import {ModConfig} from "../mg/config/IConfig";

export class CommonlLoad {

    private mod: any;
    private ConfigJson: ModConfig;

    constructor(mod: any, data: ModConfig) {
        this.mod = mod;
        this.ConfigJson = data;
        this.onload();
    }

    public onload<T>(): T {
        return;
    }

    public init<T>(): T {
        return;
    }
}