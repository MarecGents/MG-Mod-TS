import { CommonlLoad } from "../models/external/CommonLoad";
import { DatabaseService } from "@spt/services/DatabaseService";
import {IBuff, IGlobals} from "@spt/models/eft/common/IGlobals";
import { LoadList } from "../models/mg/services/ILoadList";
import { BuffList } from "../models/mg/globals/ITraderGlobals";
import {Mod} from "../../mod";
import {loadMod} from "../loadMod";


export class MGGlobals{

    private mod:Mod;
    private className:string;
    private MGLoad:loadMod;
    private databaseService: DatabaseService;

    
    constructor(mod: Mod, MGLoad:loadMod) {
        this.mod = mod;
        this.className = "MGGlobals";
        this.MGLoad = MGLoad;
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public getGlobals():IGlobals {
        return this.databaseService.getGlobals();
    }

    public addNewBuff(BuffName: string,Buff:IBuff[]): void {
        let globalsBuffs:any = this.getGlobals().config.Health.Effects.Stimulator.Buffs;
        if (BuffName in globalsBuffs) {
            this.MGLoad.Output.warning(`针剂Buff名称：${BuffName} 重复！请更换其他Buff名称`);
            return;
        } else {
            globalsBuffs[BuffName] = Buff;
            return;
        }
    }

    public addNewBuffs(Buffs: BuffList):void {
        for (let BuffName in Buffs) {
            this.addNewBuff(BuffName, Buffs[BuffName]);
        }
    }


}