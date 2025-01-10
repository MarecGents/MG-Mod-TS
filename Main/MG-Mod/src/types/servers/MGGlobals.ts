import { CommonlLoad } from "../models/external/CommonLoad";
import { DatabaseService } from "@spt/services/DatabaseService";
import {IBuff, IGlobals} from "@spt/models/eft/common/IGlobals";
import { LoadList } from "../models/mg/services/ILoadList";
import { BuffList } from "../models/mg/globals/ITraderGlobals";
import {Mod} from "../../mod";


export class MGGlobals extends CommonlLoad {

    protected databaseService: DatabaseService;
    protected globals: IGlobals;
    protected loadList: LoadList;
    
    constructor(mod: Mod) {
        super(mod);
    }

    public init(){
        this.className = "MGGlobals";
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
        this.globals = this.databaseService.getGlobals();
    }
    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
        }
    }

    public getGlobals(){
        return this.globals;
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


}