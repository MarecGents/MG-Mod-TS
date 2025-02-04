import {LoadList} from "../mg/services/ILoadList";
import { OutputService } from "../../services/OutputService";
import {Mod} from "../../../mod";


export class CommonlLoadTest {

    public mod: Mod;
    public className: string;
    constructor(mod: Mod) {
        this.mod = mod;
        this.init()
    }
    public init():void{

    }
}