import {LoadList} from "../mg/services/ILoadList";
import { OutputServices } from "../../services/OutputServices";
import {Mod} from "../../../mod";


export class CommonlLoad {

    protected mod: Mod;
    protected loadList: LoadList;
    protected className: string;
    protected output: OutputServices;
    constructor(mod: any) {
        this.mod = mod;
        this.init()
    }
    public init(){

    }

    public onload(loadList?: LoadList) {

    }
}