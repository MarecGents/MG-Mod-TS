import {LoadList, MGList} from "../types/models/mg/services/ILoadList";
import {MGLocales} from "../types/services/MGLocales";
import {FormatOutput} from "../types/servers/FormatOutput";

export class CustomTraderService {
    private loadList:LoadList;
    private mod: any;
    private MGList: MGList;
    private Locales:MGLocales
    private outPut: FormatOutput;

    constructor(mod:any,loadList:LoadList) {
        this.mod = mod;
        this.loadList = loadList;

        this.MGList = this.loadList.MGList;
        this.Locales = this.loadList.MGList.MGlocales;
        this.outPut = this.loadList.Output;

    }

}