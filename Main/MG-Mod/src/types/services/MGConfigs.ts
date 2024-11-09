import {CommonlLoad} from "../models/external/CommonLoad";
import {ConfigServer} from "@spt/servers/ConfigServer";
import {LoadList} from "../models/mg/services/ILoadList";
import {ConfigTypes} from "@spt/models/enums/ConfigTypes";
import {MinMax} from "@spt/models/common/MinMax";

export class MGConfigs extends CommonlLoad {

    private ConfigServer: ConfigServer;
    private loadList: LoadList;

    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList) {
        this.loadList = loadList;
        this.ConfigServer = this.mod.container.resolve<ConfigServer>("ConfigServer");
    }

    public getConfig(configType){
        return this.ConfigServer.getConfig(configType);
    }
    /**
     * @param configType like spt-bot is going to load database/config/bot.json
     * @param index  like ['presetBatch', 'assault'] is shown that you want change the value of bot["presetBatch"]["assault"]
     * or bot.presetBatch.assault
     * @param value is the value you want change under index
     * @constructor
     */
    public ConfigsUpdate(configType:ConfigTypes,index:string[],value:any) {
        let Nowconfig = this.getConfig(configType);
        const indexStr = index.map(ele => `.${ele}`).join("")
        eval(`Nowconfig${indexStr} = value`);
    }

    /**
     * change the default update time in trader.json using key: "updateTimeDefault"
     */
    public c_defaultUpdateTime(value:number){
        let traderConfig = this.getConfig(ConfigTypes.TRADER);
        traderConfig.updateTimeDefault = value;
    }

    /**
     * change all traders' updateTime with same value
     * @param value1  if sinlge value input , all trader's updateTime min and max with the same value
     * @param value2  when value2 inpuit  the value1 represent max, value2 represent max
     * habitually updateTime can not smaller than 60s that is value1>=value2>=60
     */
    public c_tradersUpdateTimeAllSame(value1:number, value2?:number){
        let traderConfig = this.getConfig(ConfigTypes.TRADER);
        const seconds:MinMax = {
            max:value1,
            min:value2?value2:value1
        }
        for(let it in traderConfig.updateTime){
            traderConfig.updateTime[it].seconds = seconds;
        }
    }

    public c_traderUpdateTime(traderId_name:string,seconds:MinMax){
        let traderConfig = this.getConfig(ConfigTypes.TRADER);
        for(let it in traderConfig.updateTime){
            if(traderConfig.updateTime[it]._id === traderId_name || traderConfig.updateTime[it].name == traderId_name){
                traderConfig.updateTime[it].seconds = seconds;
            }
        }
    }

    /**
     * change the value of items durability sold on flea by config/ragfair.dynamic.condition
     * @param chance belong to 0~1 with the unified value to change all types
     */
    public c_RagfairDynamicCondition(chance:number){
        chance = chance<1?chance:chance/100;
        let RagfairConfig = this.getConfig(ConfigTypes.RAGFAIR);
        for(let id in RagfairConfig.dynamic.condition){
            RagfairConfig.dynamic.condition[id].conditionChance = chance
        }
    }
}