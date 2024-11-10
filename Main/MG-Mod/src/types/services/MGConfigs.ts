import {CommonlLoad} from "../models/external/CommonLoad";
import {ConfigServer} from "@spt/servers/ConfigServer";
import {LoadList} from "../models/mg/services/ILoadList";
import {ConfigTypes} from "@spt/models/enums/ConfigTypes";
import {MinMax} from "@spt/models/common/MinMax";
import {equipmentTypes} from "../models/enums/RepairTypes";
import {ValueHepler} from "../helpers/ValueHepler";

export class MGConfigs extends CommonlLoad {

    private ConfigServer: ConfigServer;
    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList?: LoadList) {
        this.loadList = loadList;
        this.valueHelper = this.loadList.ValueHelper;
        this.ConfigServer = this.mod.container.resolve<ConfigServer>("ConfigServer");
    }

    public getConfig(configType:ConfigTypes) {
        return this.ConfigServer.getConfig(configType);
    }

    /**
     * change the default update time in trader.json using key: "updateTimeDefault"
     */
    public c_defaultUpdateTime(value: number) {
        let traderConfig = this.getConfig(ConfigTypes.TRADER);
        traderConfig.updateTimeDefault = value;
    }

    /**
     * change all traders' updateTime with same value
     * @param value1  if sinlge value input , all trader's updateTime min and max with the same value
     * @param value2  when value2 inpuit  the value1 represent max, value2 represent max
     * habitually updateTime can not smaller than 60s that is value1>=value2>=60
     */
    public c_tradersUpdateTimeAllSame(value1: number, value2?: number) {
        let traderConfig = this.getConfig(ConfigTypes.TRADER);
        const seconds: MinMax = {
            max: value1,
            min: value2 ? value2 : value1
        }
        let upTime = this.valueHelper._getValue(traderConfig, ["updateTime"]);
        for(let it in upTime){
            upTime[it].seconds = seconds;
        }
    }

    public c_traderUpdateTime(traderId_name: string, seconds: MinMax) {
        let traderConfig = this.getConfig(ConfigTypes.TRADER);
        for (let it in traderConfig.updateTime) {
            if (traderConfig.updateTime[it]._id === traderId_name || traderConfig.updateTime[it].name == traderId_name) {
                traderConfig.updateTime[it].seconds = seconds;
            }
        }
    }

    /**
     * change the value of items durability sold on flea by config/ragfair.dynamic.condition
     * @param chance is in the interval 0~1 as the unified value to change all types
     */
    public c_RagfairDynamicConditionChance(chance: number) {
        chance = chance < 1 ? chance : chance / 100;
        let RagfairConfig = this.getConfig(ConfigTypes.RAGFAIR);
        for (let id in RagfairConfig.dynamic.condition) {
            RagfairConfig.dynamic.condition[id].conditionChance = chance
        }
    }

    public c_traderInsuranceChance(chance: number) {
        if (chance < 1) {
            chance = Math.round(chance * 100);
        }
        let returnCP = this.valueHelper._getValue(this.getConfig(ConfigTypes.INSURANCE), ["returnChancePercent"]);
        for(let it in returnCP) {
            returnCP[it] = chance;
        }
    }

    public c_EquipmentBuffConfigs(type: equipmentTypes, chance: number) {
        let rarityWeight = {
            "common": chance / 100,
            "rare": chance / 100
        }
        let Repair = this.getConfig(ConfigTypes.REPAIR);
        this.valueHelper._ValueUpdate(Repair, ["repairKit", type, "rarityWeight"], rarityWeight);
        if (type in ["armor", "weapon"]) {
            this.valueHelper._ValueUpdate(Repair, ["repairKitIntellectGainMultiplier", type], chance);
        }
        this.valueHelper._ValueUpdate(Repair, ["maxIntellectGainPerRepair", type, "kit"], chance);
        if (type === "armor") {
            Repair.armorKitSkillPointGainPerRepairPointMultiplier *= chance;
        } else if (type === "weapon") {
            Repair.weaponSkillRepairGain *= chance;
        }
    }

    /**
     *
     * @param value  only if not types input , value is the whole weather.json/weather object
     * @param types  like
     * { "clouds":{
     *      values: [xx],
     *      weights:[xx]
     *      }
     * } etc.
     */
    public c_weatherConfig(value: any, types?: string) {
        let WeatherConfig = this.getConfig(ConfigTypes.WEATHER);
        if (!types) {
            WeatherConfig.weather = value;
        } else {
            WeatherConfig.weather[types] = value;
        }
    }
}