import {MGModConfig} from "../mg/config/IConfig";
import {LoadList} from "../mg/services/ILoadList";

export class CommonlLoad {

    private mod: any;
    constructor(mod: any) {
        this.mod = mod;
    }
    public onload(loadList?: LoadList) {

    }
}