import {LoadList} from "../mg/services/ILoadList";
import {ValueHepler} from "../../helpers/ValueHepler";
import { FormatOutput } from "../../servers/FormatOutput";


export class CommonlLoad {

    protected mod: any;
    protected loadList: LoadList;
    protected className: string;
    protected output: FormatOutput;
    protected valueHelper: ValueHepler;
    constructor(mod: any) {
        this.mod = mod;
    }
    public onload(loadList?: LoadList) {
    }
}