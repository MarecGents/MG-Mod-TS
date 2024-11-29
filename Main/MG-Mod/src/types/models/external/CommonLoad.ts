import {LoadList} from "../mg/services/ILoadList";
import {ValueHepler} from "../../helpers/ValueHepler";

export class CommonlLoad {

    private mod: any;
    protected loadList: LoadList;
    private className: string;
    //protected valueHelper: ValueHepler;
    constructor(mod: any) {
        this.mod = mod;
    }
    public onload(loadList?: LoadList) {
    }
}