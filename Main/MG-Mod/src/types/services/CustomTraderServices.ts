import {LoadList, MGList} from "../models/mg/services/ILoadList";
import {MGLocales} from "../servers/MGLocales";
import {FormatOutput} from "./FormatOutput";
import {Mod} from "../../mod";

export class CustomTraderService {
    private loadList:LoadList;
    private mod: Mod;
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