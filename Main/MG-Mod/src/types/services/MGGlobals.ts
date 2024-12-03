import { CommonlLoad } from "../models/external/CommonLoad";
import { DatabaseService } from "@spt/services/DatabaseService";
import {IBuff, IGlobals} from "@spt/models/eft/common/IGlobals";
import { LoadList } from "../models/mg/services/ILoadList";
import { BuffList } from "../models/mg/globals/ITraderGlobals";


export class MGGlobals extends CommonlLoad {

    protected databaseService: DatabaseService;
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
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
        this.globals = this.databaseService.getGlobals();
    }

    public addNewBuff(BuffName: string,Buff:IBuff[]): void {
        let globalsBuffs = this.globals.config.Health.Effects.Stimulator.Buffs;
        if (BuffName in globalsBuffs) {
            this.loadList.Output.warning(`针剂Buff名称：${BuffName} 重复！请更换其他Buff名称`);
            return;
        } else {
            globalsBuffs[BuffName] = Buff;
            return;
        }
    }

    public addNewBuffs(Buffs: BuffList) {
        for (let BuffName in Buffs) {
            this.addNewBuff(BuffName, Buffs[BuffName]);
        }
    }

    public c_globalConfig(index: string[], value: any, key?: string) {
        this.valueHelper._ValueUpdate(this.globals.config, index, value, key);
    }

    public _getGlobalValue(index: string[], value: any, key?: string) {
        return this.valueHelper._getValue(this.globals, index, key);
    }


}