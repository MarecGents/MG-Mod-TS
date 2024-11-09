import {LoadList, MGList} from "../types/models/mg/services/ILoadList";

export class Main{
    private loadList:LoadList;
    private mod: any;
    private MGList: MGList;
    constructor(mod,loadList:LoadList){
        this.loadList = loadList;
        this.MGList = this.loadList.MGList;
        this.mod = mod;
        this.start();
    }

    public start(){
        this.MGList.MGconfigs.ConfigsUpdate("spt-bot",["presetBatch","assault"],10);
        this.loadList.Output._OutputAny(this.MGList.MGconfigs.getConfig("spt-bot").presetBatch.assault,"red");
    }
}