import {LoadList, MGList} from "../mg/services/ILoadList";
import {MGLocales} from "../../servers/MGLocales";
import {OutputServices} from "../../services/OutputServices";
import {Mod} from "../../../mod";

export class CustomService {
    protected loadList: LoadList;
    protected mod: any;
    protected MGList: MGList;
    protected Locales: MGLocales
    protected outPut: OutputServices;

    constructor(mod: Mod, loadList: LoadList) {
        this.mod = mod;
        this.loadList = loadList;
        this.MGList = this.loadList.MGList;
        this.Locales = this.MGList.MGlocales;
        this.outPut = this.loadList.Output;
    }

    public start():void {}
}