import {LoadList, MGList} from "../types/models/mg/services/ILoadList";
import {ValueHepler} from "../types/helpers/ValueHepler";
import {FormatOutput} from "../types/servers/FormatOutput";

export class Main{
    private loadList:LoadList;
    private mod: any;
    private MGList: MGList;
    private updateValue: ValueHepler;
    private outPut: FormatOutput;
    constructor(mod,loadList:LoadList){
        this.loadList = loadList;
        this.MGList = this.loadList.MGList;
        this.updateValue = this.loadList.ValueHelper;
        this.outPut = this.loadList.Output;
        this.mod = mod;
        this.start();
    }

    public start(){

    }
}