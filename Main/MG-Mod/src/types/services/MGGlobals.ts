import { CommonlLoad } from "../models/external/CommonLoad";
import { DatabaseService } from "@spt/services/DatabaseService";
import { IGlobals } from "@spt/models/eft/common/IGlobals";
import { LoadList } from "../models/mg/services/ILoadList";
import { BuffList } from "../models/mg/globals/ITraderGlobals";


export class MGGlobals extends CommonlLoad {

    protected globals: IGlobals;
    protected loadList: LoadList;
    protected className = "MGGlobals";
    
    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
            this.valueHelper = this.loadList.ValueHelper;
        }
        this.globals = this.mod.container.resolve<DatabaseService>("DatabaseService").getGlobals();
    }

    public getGlobals(): IGlobals {
        return this.globals;
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

    public c_globalConfig(index: string[], value: any, key?: string) {
        this.valueHelper._ValueUpdate(this.globals.config, index, value, key);
    }

    public _getGlobalValue(index: string[], value: any, key?: string) {
        return this.valueHelper._getValue(this.globals, index, key);
    }


}