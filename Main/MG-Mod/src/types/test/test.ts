import {DatabaseServer} from "@spt/servers/DatabaseServer";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
export class Test{
    private mod: any;
    private ConfigJson: object;
    private color = LogTextColor;
    constructor(mod,data) {
        this.mod = mod;
        this.ConfigJson = data;
    }

    test1(){
    }
}