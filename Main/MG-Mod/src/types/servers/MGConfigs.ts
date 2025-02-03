import {ConfigServer} from "@spt/servers/ConfigServer";
import {ConfigTypes} from "@spt/models/enums/ConfigTypes";
import {MinMax} from "@spt/models/common/MinMax";
import {IAirdropConfig} from "@spt/models/spt/config/IAirdropConfig"
import {IBotConfig} from "@spt/models/spt/config/IBotConfig"
import {IInRaidConfig, IRaidMenuSettings} from "@spt/models/spt/config/IInRaidConfig";
import {IInsuranceConfig} from "@spt/models/spt/config/IInsuranceConfig"
import {ILocationConfig} from "@spt/models/spt/config/ILocationConfig"
import {IPmcConfig} from "@spt/models/spt/config/IPmcConfig"
import {IRagfairConfig} from "@spt/models/spt/config/IRagfairConfig"
import {IRepairConfig} from "@spt/models/spt/config/IRepairConfig";
import {IFenceConfig, ITraderConfig} from "@spt/models/spt/config/ITraderConfig";
import {IWeatherConfig} from "@spt/models/spt/config/IWeatherConfig";
import {Mod} from "../../mod";
import {IQuestConfig} from "../../../types/models/spt/config/IQuestConfig";
import {CustomTraderInfo} from "../models/mg/traders/ITraderCustom";
import {loadMod} from "../loadMod";

export class MGConfigs{

    private mod:Mod;
    private className:string;
    private MGLoad:loadMod;
    private ConfigServer: ConfigServer;

    constructor(mod: Mod, MGLoad:loadMod) { //
        this.mod = mod;
        this.className = "MGConfigs";
        this.MGLoad = MGLoad;
        this.ConfigServer = this.mod.container.resolve<ConfigServer>("ConfigServer");
    }

    public getConfig<T>(configType: ConfigTypes):T {
        return this.ConfigServer.getConfig(configType);
    }

    /**
     * @description airdrop.json
     */
    public c_airdropType(Type: string):void {
        let airdrop:IAirdropConfig = this.getConfig(ConfigTypes.AIRDROP);
        let Weight = airdrop.airdropTypeWeightings;
        if (Type === "moreWeapon") {
            Weight.weaponArmor = 12;
        } else if (Type === "moreFoodMedical") {
            Weight.foodMedical = 12;
        } else if (Type === "moreBarter") {
            Weight.barter = 12;
        } else if (Type === "moreMixed") {
            Weight.mixed = 9;
        }
    }

    /**
     * @description bot.json
     */

    public c_maxBotCap(botadd: number):void {
        let bot:IBotConfig = this.getConfig(ConfigTypes.BOT);
        Object.keys(bot.maxBotCap).forEach(key => {
            bot.maxBotCap[key] += botadd;
        });
    }

    /**
     * @description inraid.json
     */

    public c_raidMenuSettings(raidMenuSettings: IRaidMenuSettings):void {
        let inraid:IInRaidConfig = this.getConfig(ConfigTypes.IN_RAID);
        inraid.raidMenuSettings = raidMenuSettings;
    }

    /**
     * @description insurance.json
     */

    public c_TraderReturnChance(chance: number):void {
        if (chance < 1) {
            chance = Math.round(chance * 100);
        }
        let insurance:IInsuranceConfig = this.getConfig(ConfigTypes.INSURANCE);
        Object.keys(insurance.returnChancePercent).forEach(key => {
            insurance.returnChancePercent[key] = chance;
        });
    }

    /**
     * @param traderId the trader's id
     * @param chance the chance value is from 0 to 100
     */
    public addTraderReturnChance(traderId: string, chance: number):void {
        let InsuranceConfig:IInsuranceConfig = this.getConfig(ConfigTypes.INSURANCE);
        InsuranceConfig.returnChancePercent[traderId] = chance;
    }

    /**
     * @description inventory.json
     */

    /**
     * @description item.json
     */

    /**
     * @description locale.json
     */

    /**
     * @description location.json
     */

    public c_looseLootMultiplier(multiplier: number):void {
        let location:ILocationConfig = this.getConfig(ConfigTypes.LOCATION);
        let loosesets = location.looseLootMultiplier;
        Object.keys(loosesets).forEach(key => {
            loosesets[key] *= multiplier;
        })
    }

    public c_staticLootMultiplier(multiplier: number):void {
        let location:ILocationConfig = this.getConfig(ConfigTypes.LOCATION);
        let staticsets = location.staticLootMultiplier;
        Object.keys(staticsets).forEach(key => {
            staticsets[key] *= multiplier;
        })
    }

    /**
     * @description loot.json
     */

    /**
     * @description lostondeath.json
     */

    /**
     * @description match.json
     */

    /**
     * @description playerscav.json
     */

    /**
     * @description pmc.json
     */

    public pmcEquipmentBlackList(itemId: string):void {
        let pmcConfig:IPmcConfig = this.getConfig(ConfigTypes.PMC);
        const lootSlots = ['vestLoot', 'pocketLoot', 'backpackLoot'];
        lootSlots.forEach(value => {
            if (pmcConfig[value].blacklist && !(itemId in pmcConfig[value].blacklist)) {
                pmcConfig[value].blacklist.push(itemId);
            }
        })
    }

    public c_convertIntoPmcChance(pmcPercent: number):void {
        let pmc:IPmcConfig = this.getConfig(ConfigTypes.PMC);
        pmc.convertIntoPmcChance.default.assult = {
            min: pmcPercent,
            max: pmcPercent
        };
        pmc.convertIntoPmcChance.factory4_day.assult = {
            min: pmcPercent,
            max: pmcPercent
        };
    }

    /**
     * @description pmcchatresponse.json
     */

    /**
     * @description quest.json
     */

    public addRepeatableQuestsTraderWhitelist(TraderInfo:CustomTraderInfo):void{

        const TraderWhitelist = {
            questTypes: ["Completion", "Exploration", "Elimination"],
            rewardBaseWhitelist: [
                "543be6564bdc2df4348b4568",
                "5485a8684bdc2da71d8b4567",
                "590c745b86f7743cc433c5f2",
                "57864c322459775490116fbf",
                "57864a66245977548f04a81f",
                "5448f39d4bdc2d0a728b4568",
                "5448f3ac4bdc2dce718b4569",
                "5448f3a64bdc2d60728b456a",
                "57864c8c245977548867e7f1",
                "5448e8d04bdc2ddf718b4569",
                "57864e4c24597754843f8723",
                "57864ee62459775490116fc1",
                "543be5664bdc2dd4348b4569",
                "5a341c4086f77401f2541505",
                "5448e8d64bdc2dce718b4568",
                "55818ad54bdc2ddc698b4569",
                "57864a3d24597754843f8721",
                "5a341c4686f77469e155819e",
                "55818b224bdc2dde698b456f",
                "5c99f98d86f7745c314214b3",
                "55818aeb4bdc2ddc698b456a",
                "55818acf4bdc2dde698b456b",
                "57864bb7245977548b3b66c2",
                "5c164d2286f774194c5e69fa",
                "5448e5284bdc2dcb718b4567",
                "55818af64bdc2d5b648b4570",
                "5448bc234bdc2d3c308b4569",
                "55818b164bdc2ddc698b456c",
                "55818a684bdc2ddd698b456d",
                "550aa4cd4bdc2dd8348b456c",
                "550aa4dd4bdc2dc9348b4569",
                "55818a594bdc2db9688b456a",
                "55818a104bdc2db9688b4569",
                "5448e5724bdc2ddf718b4568",
                "5448e54d4bdc2dcc718b4568",
                "57bef4c42459772e8d35a53b",
                "5448e53e4bdc2d60728b4567",
                "5795f317245977243854e041",
                "5d650c3e815116009f6201d2",
                "57864ada245977548638de91",
            ],
            rewardCanBeWeapon: true,
            traderId: TraderInfo._id,
            weaponRewardChancePercent: 30,
            name:TraderInfo.locales.Nickname
        }
        const quest:IQuestConfig = this.getConfig(ConfigTypes.QUEST);
        quest.repeatableQuests[0].traderWhitelist.push(TraderWhitelist);
        quest.repeatableQuests[1].traderWhitelist.push(TraderWhitelist);
    }

    /**
     * @description ragfair.json
     */

    /**
     * @description change the value of items durability sold on flea by config/ragfair.dynamic.condition
     * @param chance is in the interval 0~1 as the unified value to change all types
     */
    public c_sellChance(chance: number):void {
        let ragfair: IRagfairConfig = this.getConfig(ConfigTypes.RAGFAIR);
        ragfair.sell.chance.base = chance;//基础概率
        ragfair.sell.chance.sellMultiplier = 2;
        ragfair.sell.chance.maxSellChancePercent = 100;
        ragfair.sell.chance.minSellChancePercent = 100;
    }

    public c_sellTime(time: MinMax):void {
        let ragfair: IRagfairConfig = this.getConfig(ConfigTypes.RAGFAIR);
        ragfair.sell.time = time;
    }

    public c_RagfairDynamicConditionChance(chance: number):void {
        chance = chance < 1 ? chance : chance / 100;
        let RagfairConfig: IRagfairConfig = this.getConfig(ConfigTypes.RAGFAIR);
        Object.keys(RagfairConfig.dynamic.condition).forEach(key => {
            RagfairConfig.dynamic.condition[key].conditionChance = chance
        })
    }

    /**
     * @param traderId the trader's ID your want to add
     * @param bool if the value is true or false
     */
    public addTradersRagfair(traderId: string, bool = true):void {
        let RagfairConfig: IRagfairConfig = this.getConfig(ConfigTypes.RAGFAIR);
        RagfairConfig.traders[traderId] = bool;
    }

    /**
     * @description repair.json
     */

    public c_repairKit(type:string,chance:number):void {
        const rarityWeight = {
            "Common": 0,
            "Rare": chance
        }
        let repair:IRepairConfig = this.getConfig(ConfigTypes.REPAIR);
        repair.repairKit[type].rarityWeight = rarityWeight
        if(type == "weapon"){
            repair.weaponSkillRepairGain *= chance;
        }
        else if(type == "Armor"){
            repair.armorKitSkillPointGainPerRepairPointMultiplier *= chance;
        }
    }

    public c_repairBuff(chance:number):void {
        let repair:IRepairConfig = this.getConfig(ConfigTypes.REPAIR);
        Object.keys(repair.repairKitIntellectGainMultiplier).forEach(key => {
            repair.repairKitIntellectGainMultiplier[key] = chance;
        })
        repair.maxIntellectGainPerRepair = {
            kit: chance/100,
            trader: chance/100
        }
    }

    /**
     * @description scavcase.json
     */

    /**
     * @description seasonalevents.json
     */

    /**
     * @description trader.json
     * @description change the default update time in trader.json using key: "updateTimeDefault"
     */

    public c_defaultUpdateTime(value: number):void {
        let traderConfig:ITraderConfig = this.getConfig(ConfigTypes.TRADER);
        traderConfig.updateTimeDefault = value;
    }

    /**
     * change all traders' updateTime with same value
     * @param value1  if sinlge value input , all trader's updateTime min and max with the same value
     * @param value2  when value2 inpuit  the value1 represent max, value2 represent max
     * habitually updateTime can not smaller than 60s that is value1>=value2>=60
     */
    public c_tradersUpdateTimeAllSame(value1: number, value2?: number):void {
        let traderConfig = this.getConfig(ConfigTypes.TRADER);
        const seconds: MinMax = {
            max: value1,
            min: value2 ? value2 : value1
        }
        let trader:ITraderConfig = this.getConfig(ConfigTypes.TRADER);
        let upTime = trader.updateTime;
        for (let it in upTime) {
            upTime[it].seconds = seconds;
        }
    }

    /**
     * @param traderId_name change func depends on trader's Id or Name
     * @param seconds custom value of update time with min,max
     */
    public c_traderUpdateTime(traderId_name: string, seconds: MinMax):void {
        let traderConfig:ITraderConfig = this.getConfig(ConfigTypes.TRADER);
        for (let it in traderConfig.updateTime) {
            if (traderConfig.updateTime[it]._id === traderId_name || traderConfig.updateTime[it].name == traderId_name) {
                traderConfig.updateTime[it].seconds = seconds;
            }
        }
    }

    /**
     * @param traderId your trader's id to add
     * @param traderName your trader's name either name , nickname or full name is ok
     * @param seconds the update time with min,max
     */
    public addNewTraderUpdateTime(traderId: string, traderName: string, seconds: MinMax):void {
        let traderConfig:ITraderConfig = this.getConfig(ConfigTypes.TRADER);
        traderConfig.updateTime.push({
            _name: traderName,
            traderId: traderId,
            seconds: seconds,
        })
    }

    public c_fence(fenceInfo:any):void {
        let traderConfig:ITraderConfig = this.getConfig(ConfigTypes.TRADER);
        let fence:IFenceConfig =  traderConfig.fence
        // 黑商出货刷新时间
        fence.partialRefreshTimeSeconds = fenceInfo.partialRefreshTimeSeconds;

        // 整枪出售数量限制
        fence.weaponPresetMinMax = fenceInfo.weaponPresetMinMax;

        // 整枪出售价格倍率
        fence.presetPriceMult = fenceInfo.presetPriceMult;
        fence.itemPriceMult = fenceInfo.itemPriceMult;

        // 部分刷新百分比
        fence.partialRefreshChangePercent = 30;
        // 每类物品数量限制
        fence.itemTypeLimits = fenceInfo.itemTypeLimits;
        let assortSize:number = 0;
        for (let id in fence.itemTypeLimits) {
            assortSize += fence.itemTypeLimits[id];
        }
        // 出售物品数量限制
        fence.assortSize = assortSize + 40;
        // 预设最大耐久百分比
        fence.weaponDurabilityPercentMinMax = fenceInfo.weaponDurabilityPercentMinMax;
        // 护甲最大耐久百分比
        fence.armorMaxDurabilityPercentMinMax = fenceInfo.armorMaxDurabilityPercentMinMax;
        // 护甲插板等级概率
        fence.chancePlateExistsInArmorPercent = fenceInfo.chancePlateExistsInArmorPercent;
        // 限制特定物品出售堆叠数  通过ID
        fence.itemStackSizeOverrideMinMax = {};
        // 子弹最大堆叠限制
        fence.ammoMaxPenLimit = fenceInfo.ammoMaxPenLimit;
        // 黑名单
        fence.blacklist = fenceInfo.blacklist;
        fence.blacklistSeasonalItems = fenceInfo.blacklistSeasonalItems;
    }

    /**
     * @description weather.json
     * @param value  only if not types input , value is the whole weather.json/weather object
     * @param types  like
     * { "clouds":{
     *      values: [xx],
     *      weights:[xx]
     *      }
     * } etc.
     */

    public c_weatherConfig(value: any, types?: string):void {
        let WeatherConfig:IWeatherConfig = this.getConfig(ConfigTypes.WEATHER);
        if (!types) {
            WeatherConfig.weather = value;
        } else {
            WeatherConfig.weather[types] = value;
        }
    }

}