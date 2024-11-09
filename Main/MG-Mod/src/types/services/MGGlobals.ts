import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {IGlobals} from "@spt/models/eft/common/IGlobals";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";
import {BuffList} from "../models/mg/globals/ITraderGlobals";

export class MGGlobals extends CommonlLoad {
    private globals: IGlobals;
    private loadList: LoadList;

    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList) {
        this.loadList = loadList;
        this.globals = this.mod.container.resolve<DatabaseService>("DatabaseService").getGlobals();
    }

    public addNewBuffs(Buffs: BuffList) {
        let globalsBuffs = this.globals.config.Health.Effects.Stimulator.Buffs;
        for (let BuffName in Buffs) {
            if (!(BuffName in globalsBuffs)) {
                globalsBuffs[BuffName] = Buffs[BuffName];
            } else {
                this.loadList.Output.buffNameRepeat(BuffName);
            }
        }
    }

    public c_globalConfig(index:string[],value:any){
        this.loadList.ValueUpdate._ValueUpdate(this.globals.config,index,value);
    }


}