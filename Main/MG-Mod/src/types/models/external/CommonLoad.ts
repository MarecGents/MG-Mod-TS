import {LoadList} from "../mg/services/ILoadList";
import { OutputServices } from "../../services/OutputServices";
import {Mod} from "../../../mod";


export class CommonlLoad {

    protected mod: Mod;
    protected className: string;
    constructor(mod: Mod) {
        this.mod = mod;
        this.init()
    }
    public init():void{

    }
}