import {LoadList} from "../mg/services/ILoadList";
import { OutputServices } from "../../services/OutputServices";
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