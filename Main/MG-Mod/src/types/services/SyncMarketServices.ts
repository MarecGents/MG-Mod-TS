import {CustomService} from "../models/external/CustomService";
import {Mod} from "../../mod";
import {LoadList} from "../models/mg/services/ILoadList";

export class SyncMarketServices extends CustomService{

    constructor(mod: Mod, loadList: LoadList) {
        super(mod,loadList);
    }

    public start():void {

    }
}