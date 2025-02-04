import {LoadList} from "../mg/services/ILoadList";
import { OutputService } from "../../services/OutputService";
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