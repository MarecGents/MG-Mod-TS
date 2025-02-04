import {ConfigTypes} from "@spt/models/enums/ConfigTypes";
import {OutputServices} from "../types/services/OutputServices";
import {MGModConfig} from "../types/models/mg/config/IConfig";
import {IClone} from "../types/utils/IClone";
import {PathTypes} from "../types/models/enums/PathTypes";
import {MGBots} from "../types/servers/MGBots";
import {MGConfigs} from "../types/servers/MGConfigs";
import {MGGlobals} from "../types/servers/MGGlobals";
import {MGHideout} from "../types/servers/MGHideout";
import {MGLocations} from "../types/servers/MGLocations";
import {MapChType} from "../types/models/enums/MapChType";
import {MGTemplates} from "../types/servers/MGTemplates";
import {MGLocales} from "../types/servers/MGLocales";
import {MGTraders} from "../types/servers/MGTraders";
import {IProps, ITemplateItem} from "@spt/models/eft/common/tables/ITemplateItem";
import {configContainer} from "../types/models/mg/items/EItems";
import {Mod} from "../mod";
import {ITrader, ITraderBase} from "@spt/models/eft/common/tables/ITrader";
import {IQuest, IQuestCondition} from "@spt/models/eft/common/tables/IQuest";
import {IRepeatableQuestDatabase} from "@spt/models/eft/common/tables/IRepeatableQuests";
import {ILocations} from "@spt/models/spt/server/ILocations";
import {IBossLocationSpawn, IExit} from "@spt/models/eft/common/ILocationBase";
import {IConfig, IGlobals} from "@spt/models/eft/common/IGlobals";
import {IInsuranceConfig} from "@spt/models/spt/config/IInsuranceConfig";
import {IInventoryConfig} from "@spt/models/spt/config/IInventoryConfig";
import {ILocationConfig} from "@spt/models/spt/config/ILocationConfig";
import {IRagfairConfig} from "@spt/models/spt/config/IRagfairConfig";
import {ITraderConfig} from "@spt/models/spt/config/ITraderConfig";
import {IWeatherConfig} from "@spt/models/spt/config/IWeatherConfig";
import {CustomTraderService} from "../types/services/CustomTraderServices";
import {CustomItemsService} from "../types/services/CustomItemsServices";
import {loadMod} from "../types/loadMod";
import {KeysClassifyServices} from "../types/services/KeysClassifyServices";
import {SyncMarketServices} from "../types/services/SyncMarketServices";

export class Main{

    private mod: Mod;
    private MGLoad:loadMod;
    private Locales:MGLocales
    private outPut: OutputServices;

    constructor(mod:Mod,MGLoad:loadMod){
        this.mod = mod;
        this.MGLoad = MGLoad;
        this.Locales = this.MGLoad.MGLocales;
        this.outPut = this.MGLoad.Output;
        this.start();
    }

    public start():void{
        const ConfigJson: MGModConfig = new IClone(this.mod).clone(PathTypes.ModConfigPath).config;

        (new SyncMarketServices(this.mod, this.MGLoad)).start();
        this.CustomTraderServices(ConfigJson);
        this.CustomItemsServices(ConfigJson);
        (new KeysClassifyServices(this.mod, this.MGLoad)).start(ConfigJson);
        this.BotsServices(this.MGLoad.MGBots, ConfigJson);
        this.ConfigServices(this.MGLoad.MGConfigs, ConfigJson);
        this.GlobalsServices(this.MGLoad.MGGlobals, ConfigJson);
        this.HideoutServices(this.MGLoad.MGHideout, ConfigJson);
        this.LocationsServices(this.MGLoad.MGLocations, ConfigJson);
        this.TemplatesServices(this.MGLoad.MGTemplates, ConfigJson);
        this.TradersServices(this.MGLoad.MGTraders, ConfigJson);


    }

    private BotsServices(MGBots:MGBots,ConfigJson:MGModConfig):void {
        const botsJson:any = ConfigJson.bots;
        // 功能：AI血量
        if(botsJson.healthRate && botsJson.healthRate !== "default"){
            MGBots.c_BotsHeathByRate(botsJson.healthRate)
        }

        this.outPut.classLoaded("[MG-Mod][BotsServices]");
    }

    private ConfigServices(MGConfigs:MGConfigs,ConfigJson:MGModConfig):void {
        const configJson:any = ConfigJson.configs;

        // airdrop.json
        // let airdrop = MGConfigs.getConfig(ConfigTypes.AIRDROP);
        // 功能：空投种类
        if (configJson.airdrop.airdropType !== "default") {
            MGConfigs.c_airdropType(configJson.airdrop.airdropType)
        }
        // backup.json

        // bot.json
        // let bot = MGConfigs.getConfig(ConfigTypes.BOT);
        // 功能：AI刷新数量
        if(configJson.botmod.botadd && configJson.botmod.botadd !== 0){
            MGConfigs.c_maxBotCap(configJson.botmod.botadd)
        }

        // core.json
        // gifts.json
        // health.json
        // hideout.json
        // http.json

        // inraid.json
        // let inraid = MGConfigs.getConfig(ConfigTypes.IN_RAID);
        // 功能：战局默认选项
        if(configJson.inraid && configJson.inraid.raidMenuSettings){
            MGConfigs.c_raidMenuSettings(configJson.inraid.raidMenuSettings);
        }

        // insurance.json
        let insurance:IInsuranceConfig = MGConfigs.getConfig(ConfigTypes.INSURANCE);
        //功能：商人百分百回保
        if (configJson.returnChance.enable) {
            MGConfigs.c_TraderReturnChance(100);
            insurance.runIntervalSeconds = configJson.returnChance.runIntervalSeconds;
        }

        // inventory.json
        let inventory:IInventoryConfig = MGConfigs.getConfig(ConfigTypes.INVENTORY);
        // 功能：购买物品带钩
        if(configJson.newItemsMarkedFound){
            inventory.newItemsMarkedFound = configJson.newItemsMarkedFound;
        }

        // item.json
        // locale.json

        // location.json
        let location:ILocationConfig = MGConfigs.getConfig(ConfigTypes.LOCATION);
        // 功能：容器物资倍率
        if(configJson.LootMultiplier.container !== 1){
            MGConfigs.c_staticLootMultiplier(configJson.LootMultiplier.container);
        }
        // 功能：地面物资倍率
        if(configJson.LootMultiplier.static !== 1){
            MGConfigs.c_looseLootMultiplier(configJson.LootMultiplier.static);
        }
        //功能：容器随机生成
        // location.containerRandomisationSettings.enabled=false;

        // loot.json
        // lostondeath.json
        // match.json
        // playerscav.json

        // pmc.json
        // let pmc = MGConfigs.getConfig(ConfigTypes.PMC);
        // pmc占比
        if (configJson.botmod.pmcPercent !== "default") {
            MGConfigs.c_convertIntoPmcChance(configJson.botmod.pmcPercent);
        }

        // pmcchatresponse.json
        // quest.json

        // ragfair.json
        let ragfair:IRagfairConfig = MGConfigs.getConfig(ConfigTypes.RAGFAIR);
        // 功能：出售概率
        if (configJson.chance.enable){
            MGConfigs.c_sellChance(configJson.chance.base);
        }
        // 功能：跳蚤极速出售
        if (configJson.time.enable) {
            MGConfigs.c_sellTime({
                min:configJson.time.min,
                max:configJson.time.max
            })
        }
        // 功能：购买物品带钩
        if(configJson.newItemsMarkedFound){
            ragfair.dynamic.purchasesAreFoundInRaid = configJson.newItemsMarkedFound;
        }
        // 功能：跳蚤购买优化
        if (configJson.dynamic.FleaOptimize.enable){
            // 跳蚤不可堆叠物品出售数量
            ragfair.dynamic.nonStackableCount = configJson.dynamic.FleaOptimize.nonStackableCount;
            // 跳蚤可堆叠物品出售数量
            ragfair.dynamic.stackablePercent = configJson.dynamic.FleaOptimize.stackablePercent;
            // // 跳蚤显示为单个物品的
            ragfair.dynamic.showAsSingleStack = configJson.dynamic.FleaOptimize.showAsSingleStack;
            // 护甲没有插板概率
            ragfair.dynamic.armor.removeRemovablePlateChance = configJson.dynamic.FleaOptimize.armor.removeRemovablePlateChance;

        }
        // 功能：跳蚤物品全新
        if (configJson.dynamic.condition){
            MGConfigs.c_RagfairDynamicConditionChance(0);
        }
        // 功能：禁用跳蚤黑名单
        if (!configJson.dynamic.blacklistEnable) {
            ragfair.dynamic.blacklist.enableBsgList = configJson.dynamic.blacklistEnable;
        }

        // repair.json
        // let repair:IRepairConfig = MGConfigs.getConfig(ConfigTypes.RAGFAIR);
        // 功能：护甲附魔
        // 功能 护甲附魔
        if (configJson.BuffSettings.AmmoBuff !== "default"){
            MGConfigs.c_repairKit("armor",configJson.BuffSettings.AmmoBuff);
            MGConfigs.c_repairKit("vest",configJson.BuffSettings.AmmoBuff);
            MGConfigs.c_repairKit("headwear",configJson.BuffSettings.AmmoBuff);
        }
        // 功能：武器附魔
        if (configJson.BuffSettings.WeaponBuff !== "default"){
            MGConfigs.c_repairKit("weapon",configJson.BuffSettings.AmmoBuff);
        }
        // 功能：附魔
        MGConfigs.c_repairBuff(100);

        // scavcase.json
        // seasonalevents.json

        // trader.json
        let trader:ITraderConfig = MGConfigs.getConfig(ConfigTypes.TRADER);
        // 功能：商人供货时间
        if(configJson.updateTimeDefault !== 3600){
            MGConfigs.c_defaultUpdateTime(configJson.updateTimeDefault);
        }
        if(configJson.updateTime !== 3600){
            MGConfigs.c_tradersUpdateTimeAllSame(configJson.updateTime);
        }
        // 功能：黑商优化
        if(configJson.fence.enable){
            MGConfigs.c_fence(configJson.fence);
        }
        // 功能：购买物品带钩
        if(configJson.newItemsMarkedFound){
            trader.purchasesAreFoundInRaid = configJson.newItemsMarkedFound;
        }

        // weather.json
        let weather:IWeatherConfig = MGConfigs.getConfig(ConfigTypes.WEATHER);
        // 功能：天气修改
        if (configJson.weather.OverAll !== "default"){
            MGConfigs.c_weatherConfig({
                "values": [
                    -1,
                    -0.8,
                    -0.5,
                    0.1,
                    0,
                    0.15,
                    0.4,
                    1
                ],
                "weights": [
                    100,
                    22,
                    22,
                    15,
                    15,
                    15,
                    5,
                    4
                ]
            },"clouds");
            MGConfigs.c_weatherConfig({
                "values": [
                    0,
                    1,
                    2,
                    3,
                    4
                ],
                "weights": [
                    6,
                    3,
                    2,
                    1,
                    1
                ]
            },"windSpeed");
            MGConfigs.c_weatherConfig({
                "values": [
                    1,
                    2,
                    3,
                    4,
                    5
                ],
                "weights": [
                    25,
                    1,
                    1,
                    1,
                    1
                ]
            },"rain");
            MGConfigs.c_weatherConfig({
                "min": 0,
                "max": 1
            },"rainIntensity");
            MGConfigs.c_weatherConfig({
                "values": [
                    0.0013,
                    0.0018,
                    0.002,
                    0.004,
                    0.006
                ],
                "weights": [
                    35,
                    6,
                    4,
                    3,
                    1
                ]
            },"rainIntensity");
        }

        this.outPut.classLoaded("[MG-Mod][ConfigServices]");
    }

    private GlobalsServices(MGGlobals:MGGlobals,ConfigJson:MGModConfig):void {
        const globalJson:any = ConfigJson.globals;

        let globals:IGlobals = MGGlobals.getGlobals();
        let Glconf:IConfig = globals.config;
        // 功能：撤离时间无限制
        if(globalJson.survived_seconds_requirement !== 420){
            Glconf.exp.match_end.survived_seconds_requirement = globalJson.survived_seconds_requirement;
        }

        // 功能：跳蚤开放等级
        if(globalJson.RagFair.minUserLevel !== 15){
            Glconf.RagFair.minUserLevel = globalJson.RagFair.minUserLevel;
        }

        // 功能：去除战局携带限制
        if(globalJson.RestrictionsInRaid){
            Glconf.RestrictionsInRaid = [];
        }

        // 功能：Scav优化
        if(globalJson.ScavOptimize.enable){
            //SCAV冷却时间
            Glconf.SavagePlayCooldown = globalJson.ScavOptimize.SavagePlayCooldown;
            //SCAV剩余冷却时间
            Glconf.SavagePlayCooldownNdaFree = globalJson.ScavOptimize.SavagePlayCooldownNdaFree;
            //减少SCAV冷却时间
            Glconf.SavagePlayCooldownDevelop = globalJson.ScavOptimize.SavagePlayCooldownDevelop;
        }

        // 功能：极低税率
        if(globalJson.RagFair.TaxRate.enable){
            Glconf.RagFair.communityTax = globalJson.RagFair.TaxRate.communityTax;
            Glconf.RagFair.communityItemTax = globalJson.RagFair.TaxRate.communityItemTax;
            Glconf.RagFair.communityRequirementTax = globalJson.RagFair.TaxRate.communityRequirementTax;
        }

        // 功能：跳蚤交易单倍率
        if(globalJson.RagFair.count_Magnification !== 1){
            Glconf.RagFair.maxActiveOfferCount.forEach((index: any) =>{
                index.count *= globalJson.RagFair.count_Magnification;
            })
        }

        // 功能：装卸速度
        if(globalJson.BaseLoadTime!== 0.85 && globalJson.BaseUnloadTime !== 0.3){
            //压弹速度
            Glconf.BaseLoadTime = globalJson.BaseLoadTime;
            //卸弹速度
            Glconf.BaseUnloadTime = globalJson.BaseUnloadTime;
        }

        // 功能：超人模式
        if(globalJson.stamina.godmod){
            //基础恢复速度
            Glconf.Stamina.BaseRestorationRate = globalJson.stamina.BaseRestorationRate;
            //腿部耐力
            Glconf.Stamina.Capacity = globalJson.stamina.Capacity;
            //手部耐力
            Glconf.Stamina.HandsCapacity = globalJson.stamina.HandsCapacity;
            //氧气耐力
            Glconf.Stamina.OxygenCapacity = globalJson.stamina.OxygenCapacity;
            //氧气恢复速度
            Glconf.Stamina.OxygenRestoration = globalJson.stamina.OxygenRestoration;
            //压弹速度
            Glconf.BaseLoadTime = 0.01;
            //卸弹速度
            Glconf.BaseUnloadTime = 0.01;
        }

        // 功能：物资倍率
        if(globalJson.LootMultiplier.Valuable!==1){
            Glconf.GlobalItemPriceModifier = globalJson.LootMultiplier.Valuable;
        }
        if(globalJson.LootMultiplier.Total!==1){
            Glconf.GlobalLootChanceModifier = globalJson.LootMultiplier.Total;
            Glconf.GlobalLootChanceModifierPvE = globalJson.LootMultiplier.Total;
        }

        // 功能：护甲维修无损耗
        if(globalJson.RepairDegradation){
            Object.keys(Glconf.ArmorMaterials).forEach(key => {
                Glconf.ArmorMaterials[key].MinRepairDegradation = 0; //商人
                Glconf.ArmorMaterials[key].MaxRepairDegradation = 0;
                Glconf.ArmorMaterials[key].MinRepairKitDegradation = 0; //维修包
                Glconf.ArmorMaterials[key].MaxRepairKitDegradation = 0;
            })
        }

        // 功能：附魔
        let skillsettings = Glconf.SkillsSettings;
        //100%护甲附魔
        if(globalJson.BuffSettings.AmmoBuff!=="default"){
            let chance = globalJson.BuffSettings.AmmoBuff
            skillsettings.HeavyVests.BuffSettings.CommonBuffChanceLevelBonus = chance/100;
            skillsettings.HeavyVests.BuffSettings.CommonBuffMinChanceValue = chance/100;
            skillsettings.HeavyVests.BuffSettings.RareBuffChanceCoff = chance/100;
            skillsettings.HeavyVests.BuffSettings.CurrentDurabilityLossToRemoveBuff = 1;
            skillsettings.HeavyVests.BuffSettings.MaxDurabilityLossToRemoveBuff = 1;
            skillsettings.HeavyVests.BuffSettings.ReceivedDurabilityMaxPercent = chance;

            skillsettings.LightVests.BuffSettings.CommonBuffChanceLevelBonus = chance/100;
            skillsettings.LightVests.BuffSettings.CommonBuffMinChanceValue = chance/100;
            skillsettings.LightVests.BuffSettings.RareBuffChanceCoff = chance/100;
            skillsettings.LightVests.BuffSettings.CurrentDurabilityLossToRemoveBuff = 1;
            skillsettings.LightVests.BuffSettings.MaxDurabilityLossToRemoveBuff = 1;
            skillsettings.LightVests.BuffSettings.ReceivedDurabilityMaxPercent = chance;

            skillsettings.Melee.BuffSettings.CommonBuffChanceLevelBonus = chance/100;
            skillsettings.Melee.BuffSettings.CommonBuffMinChanceValue = chance/100;
            skillsettings.Melee.BuffSettings.RareBuffChanceCoff = chance/100;
            skillsettings.Melee.BuffSettings.CurrentDurabilityLossToRemoveBuff = 1;
            skillsettings.Melee.BuffSettings.MaxDurabilityLossToRemoveBuff = 1;
            skillsettings.Melee.BuffSettings.ReceivedDurabilityMaxPercent = chance;
        }
        //100%枪械附魔
        if(globalJson.BuffSettings.WeaponBuff!=="default"){
            let chance = globalJson.BuffSettings.WeaponBuff
            skillsettings.WeaponTreatment.BuffSettings.CommonBuffMinChanceValue = chance/100;
            skillsettings.WeaponTreatment.BuffSettings.CommonBuffChanceLevelBonus = chance/100;
            skillsettings.WeaponTreatment.BuffSettings.CurrentDurabilityLossToRemoveBuff = 1;
            skillsettings.WeaponTreatment.BuffSettings.MaxDurabilityLossToRemoveBuff = 1;
            skillsettings.WeaponTreatment.BuffSettings.RareBuffChanceCoff = chance/100;
            skillsettings.WeaponTreatment.BuffSettings.ReceivedDurabilityMaxPercent = chance;
            skillsettings.WeaponTreatment.SkillPointsPerRepair = 5000;
        }

        // 功能：练技能速度
        if(globalJson.SkillExperience){
            Glconf.SkillEnduranceWeightThreshold = 0.65;   // 耐力技能增长条件：0.1*最大负重时
            Glconf.SkillFatiguePerPoint = 1.1;    // 疲劳因子  >=1 则没有疲劳
            Glconf.SkillFatigueReset = 200;   // 疲劳结束冷却时间 (s)
            Glconf.SkillFreshEffectiveness = 3;   // 疲劳冷却后 技能升级加速300%
            Glconf.SkillMinEffectiveness = 1;   //最低获得技能点数
            Glconf.SkillPointsBeforeFatigue = 10; //技能疲劳前可以升多少级
            Glconf.SkillsSettings.SkillProgressRate = 2 //全局技能速率
            Glconf.SkillsSettings.WeaponSkillProgressRate = 2 //全局武器技能速率
            Glconf.SkillsSettings.WeaponSkillRecoilBonusPerLevel = 0.1 //每级的全局武器技能速率加成
        }

        this.outPut.classLoaded("[MG-Mod][GlobalsServices]");

    }

    private HideoutServices(MGHideout:MGHideout,ConfigJson:MGModConfig):void {
        const hideoutJson:any = ConfigJson.hideout;

        // 功能：藏身处升级时间
        if(hideoutJson.areas!=="default"){
            MGHideout.c_constructionTime(hideoutJson.areas);
        }

        // 功能：藏身处生产时间
        if(hideoutJson.production!=="default"){
            MGHideout.c_productionTime(hideoutJson.production);
        }

        // 功能：Scav宝箱
        if(hideoutJson.scavcase!=="default"){
            MGHideout.c_scavecaseTime(hideoutJson.scavcase);
        }

        this.outPut.classLoaded("[MG-Mod][HideoutServices]");

    }

    private LocationsServices(MGLocations:MGLocations,ConfigJson:MGModConfig):void {
        const locationJson:any = ConfigJson.locations;
        let Locations:ILocations = MGLocations.getLocations();
        const noNeedMapName:string[] = ["develop", "hideout", "privatearea","suburbs","terminal","town","base"]
        for(let mapName in Locations){
            if(mapName in noNeedMapName){continue;}
            if (!(typeof (Locations[mapName].base) === 'object'
                && Locations[mapName].base.Locked === false)) {continue;}
            // 功能：战局时长(分钟)
            if(locationJson.EscapeTime!=="default"){
                Locations[mapName].base.EscapeTimeLimit = locationJson.EscapeTime;
            }
            // 功能：boss刷新率
            if (typeof (Locations[mapName].base.BossLocationSpawn) === 'object'){
                let locationBoss:IBossLocationSpawn[] = Locations[mapName].base.BossLocationSpawn;
                for (let BZone of locationBoss) {
                    // 功能：boss刷新率100%
                    if (BZone.BossName.indexOf('boss') === 0 || !BZone.Supports) {
                        if(locationJson.Boss_100_Chance){
                            BZone.BossChance = 100;//出现概率
                        }
                    }

                    //暂未正式实装
                    // else if(locationJson.otherBossType.enable){
                    //     const botType = locationJson.otherBossType.botType;
                    //     for(let bT in botType){
                    //         if(BZone.BossName.indexOf(bT) === 0 && locationJson.otherBossType.botType[bT]!== "default"){
                    //             BZone.BossChance = locationJson.otherBossType.botType[bT]; //非boss类型  如 霉菌
                    //         }
                    //     }
                    // }
                }
            }
            // 功能：100%可拉闸  功能：100%可撤离
            if (typeof (Locations[mapName].base.exits) === 'object'
                && (locationJson.WorldEventChance
                    || locationJson.EscapeChance)) {
                for(let i in Locations[mapName].base.exits){
                    let exit:IExit = Locations[mapName].base.exits[i]
                    // 功能：100%可拉闸
                    if(exit.PassageRequirement === "WorldEvent" && locationJson.WorldEventChance){
                        exit.Chance = 100;
                    }
                    // 功能：100%可撤离
                    else if(locationJson.EscapeChance){
                        exit.Chance = 100;
                    }
                }
            }
            // 功能：地图是否回保
            Locations[mapName].base.Insurance=locationJson.Insurance[MapChType[mapName]];
            Locations[mapName].base.IsSecret=!locationJson.Insurance[MapChType[mapName]];

        }
        this.outPut.classLoaded("[MG-Mod][LocationsServices]");
    }

    private TemplatesServices(MGTemplates:MGTemplates,ConfigJson:MGModConfig):void {
        const itemJson:any = ConfigJson.items;
        const requestJson:any = ConfigJson.request;

        let items:Record<string, ITemplateItem> = MGTemplates.getItems();
        const itemsDB:any = (new IClone(this.mod)).clone(PathTypes.ServicesPath + "itemsDB/");
        for (let item in items) {
            let itemId:string = items[item]._id,
                itemParent:string = items[item]._parent,
                itemProps:IProps = items[item]._props;
            const AmmoBlacklist:string[] = [
                "5656eb674bdc2d35148b457c",
                "5ede474b0c226a66f5402622",
                "5ede475b549eed7c6d5c18fb",
                "5ede4739e0350d05467f73e8",
                "5ede47405b097655935d7d16",
                "5ede475339ee016e8c534742",
                "5f0c892565703e5c461894e9",
                "62389aaba63f32501b1b444f",
                "62389ba9a63f32501b1b4451",
                "62389bc9423ed1685422dc57",
                "62389be94d5d474bf712e709",
                "635267f063651329f75a4ee8"
            ];
            const container:Record<string, configContainer> = itemJson.Container;
            let MedParent:string[] = ["5448f39d4bdc2d0a728b4568", "5448f3a14bdc2d27728b4569", "5448f3a64bdc2d60728b456a", "5448f3ac4bdc2dce718b4569"];
            // 物品全检视
            itemProps.ExaminedByDefault = itemJson.ExaminedByDefault;
            //武器栏可放全部武器
            if (itemId === "55d7217a4bdc2d86028b456d"
                && itemJson.AllWeaponInColumn) {
                //主武器栏
                itemProps.Slots.find(x => x._name === 'FirstPrimaryWeapon')._props.filters[0].Filter = ['5422acb9af1c889c16000029'];
                //副武器栏
                itemProps.Slots.find(x => x._name === 'SecondPrimaryWeapon')._props.filters[0].Filter = ['5422acb9af1c889c16000029'];
                //手枪栏
                itemProps.Slots.find(x => x._name === 'Holster')._props.filters[0].Filter = ['5422acb9af1c889c16000029'];
                //近战武器栏
                itemProps.Slots.find(x => x._name === 'Scabbard')._props.filters[0].Filter = [
                    '5422acb9af1c889c16000029',
                    '5447e1d04bdc2dff2f8b4567'
                ];
            }
            // 子弹
            else if (itemParent === "5485a8684bdc2da71d8b4567") {
                if (itemJson.AmmoSetting.StackEnable) {
                    // 每个堆叠最大数量
                    itemProps.StackMaxSize = itemJson.AmmoSetting.StackMaxSize;
                    let stackmaxrandom = itemJson.AmmoSetting.StackMaxSize;
                    if (itemJson.AmmoSetting.StackMaxSize >= 100) {
                        itemProps.Weight = 0;
                        stackmaxrandom = 100;
                    }
                    if (itemJson.AmmoSetting.StackMaxSize >= 500) {
                        stackmaxrandom = 500;
                    }
                    if (AmmoBlacklist.indexOf(itemId)!==-1) {
                        itemProps.StackMinRandom = 1;
                        itemProps.StackMaxRandom = 20;
                    } else {
                        itemProps.StackMinRandom = 30;
                        itemProps.StackMaxRandom = stackmaxrandom;
                    }
                }
                // 子弹数据
                if (itemJson.AmmoSetting.Info) {
                    let retStr_ammo:string = "<color=#00cccc><b>肉伤：" + itemProps.Damage + "     甲伤：" + itemProps.ArmorDamage + "     穿甲：" + itemProps.PenetrationPower + "     穿透率：" + itemProps.PenetrationChanceObstacle + "     跳弹率：" + itemProps.RicochetChance + "     碎弹率：" + itemProps.FragmentationChance + "</b></color>\r\n";
                    let newDesc:string = retStr_ammo.concat(this.Locales.getContentByKey(item + " Description"));
                    this.Locales.addInfo({
                        _id:item + " Description",
                        desc:newDesc
                    })
                }
            }
            // 容器扩容
            else if (itemId in container) {
                // 容器扩容
                if (container[itemId].enable) {
                    let itemIssue:configContainer = container[itemId]
                    itemProps.Grids[0]._props.cellsH = itemIssue.cellsH;
                    itemProps.Grids[0]._props.cellsV = itemIssue.cellsV;
                }
                // 容器兼容
                if (container[itemId].Filter) {
                    itemProps.Grids[0]._props.filters = [{Filter: ['54009119af1c881c07000029'], ExcludedFilter: []}];
                }
                // 无负重
                if (!container[itemId].Weight) {
                    itemProps.Weight = 0;
                }
            }
            // 保险箱
            else if (itemParent === "5448bf274bdc2dfc2f8b456a") {
                // 容量格子调整为：宽6高8
                if (itemJson.SafeBox.contain.enable) {

                    itemProps.Grids[0]._props.cellsH = itemJson.SafeBox.contain.cellsH;
                    itemProps.Grids[0]._props.cellsV = itemJson.SafeBox.contain.cellsV;
                }
                // 去除安全箱物品存放限制
                if (itemJson.SafeBox.Filter) {
                    itemProps.Grids[0]._props.filters = [{Filter: ['54009119af1c881c07000029'], ExcludedFilter: []}];
                }
                // 安全箱重量(可以实现负重)
                if (!itemJson.SafeBox.Weight) {
                    itemProps.Weight = -9999;
                }
            }
            // 钱堆叠
            else if (itemParent === "543be5dd4bdc2deb348b4569"
                && itemJson.MoneyStack.enable) {
                // 每个堆叠最大数量
                itemProps.StackMaxSize = itemJson.MoneyStack.value;
                itemProps.Weight = 0;
                // 每个堆叠的最小和最大随机数量(影响战局内刷到的数量)
                if (itemId === "5449016a4bdc2d6f028b456f") {
                    itemProps.StackMinRandom = 1000;
                    itemProps.StackMaxRandom = 10000;
                }
                if (itemId === "569668774bdc2da2298b4568") {
                    itemProps.StackMinRandom = 100;
                    itemProps.StackMaxRandom = 500;
                }
                if (itemId === "5696686a4bdc2da3298b456a") {
                    itemProps.StackMinRandom = 100;
                    itemProps.StackMaxRandom = 500;
                }
            }
            // 背包、盲盒
            else if (itemParent === "5448e53e4bdc2d60728b4567") {
                // 去除物品限制
                if (itemJson.Backpack.Filter) {
                    itemProps.Grids[0]._props.filters = [{Filter: ['54009119af1c881c07000029'], ExcludedFilter: []}];
                }
                // 背包折叠
                if (itemJson.Backpack.Size) {
                    itemProps.Width = parseInt((itemProps.Width / 2).toString())
                    itemProps.Height = parseInt((itemProps.Height / 2).toString())
                }

                if (itemJson.Backpack.Buff) {
                    // 速度惩罚
                    itemProps.speedPenaltyPercent = 0;
                    // 转向惩罚
                    itemProps.mousePenalty = 0;
                    // 武器人机工效惩罚
                    itemProps.weaponErgonomicPenalty = 0;
                }
                // 无负重
                if (!itemJson.Backpack.Weight) {
                    itemProps.Weight = 0;
                }
            }
            // 弹挂修改 护甲修改
            else if (itemParent === "5448e5284bdc2dcb718b4567"
                || itemParent === "5448e54d4bdc2dcc718b4568"
                || itemParent === "57bef4c42459772e8d35a53b") {
                if (itemJson.ArmorRig.BlocksArmorVest) {
                    // 去除护甲穿戴冲突
                    itemProps.BlocksArmorVest = false;
                }
                if (itemJson.ArmorRig.Buff) {
                    // 速度惩罚
                    itemProps.speedPenaltyPercent = 0;
                    // 转向惩罚
                    itemProps.mousePenalty = 0;
                    // 武器人机工效惩罚
                    itemProps.weaponErgonomicPenalty = 0;
                }
                // 重量
                if (!itemJson.ArmorRig.Weight) {
                    itemProps.Weight = 0;
                }

            }
            // 插板耐久
            else if (itemParent === "644120aa86ffbe10ee032b6f"
                || itemParent === "65649eb40bf0ed77b8044453") {
                if (itemProps.Durability) {
                    itemProps.Durability = itemProps.Durability * itemJson.ArmorRig.DurabilityTimes;
                }
                if (itemProps.MaxDurability) {
                    itemProps.MaxDurability = itemProps.MaxDurability * itemJson.ArmorRig.DurabilityTimes;
                }
            }
            // 头盔修改
            else if (itemParent === "5a341c4086f77401f2541505") {
                if (itemJson.Helmet.BlocksArmorVest) {
                    // 去除耳机佩戴冲突
                    itemProps.BlocksEarpiece = false;
                }
                if (itemJson.Helmet.Buff) {
                    // 速度惩罚
                    itemProps.speedPenaltyPercent = 0;
                    // 转向惩罚
                    itemProps.mousePenalty = 0;
                    // 武器人机工效惩罚
                    itemProps.weaponErgonomicPenalty = 0;
                }
                if (!itemJson.Helmet.Weight) {
                    // 重量
                    itemProps.Weight = 0;
                }
            }
            // 钥匙和卡无限使用次数
            else if (itemParent === "5c164d2286f774194c5e69fa"
                || itemParent === "5c99f98d86f7745c314214b3") {
                if (itemJson.MaximumNumberOfUsage) {
                    itemProps.MaximumNumberOfUsage = 0;
                }
            }
            // 医疗物品耐久调整
            else if (MedParent.indexOf(itemParent) !== -1
                && itemJson.MedicalSupply !== "default") {
                if (itemProps.MaxHpResource === 0) {
                    itemProps.MaxHpResource = 1;
                }
                itemProps.MaxHpResource *= itemJson.MedicalSupply;
                itemProps.hpResourceRate *= itemJson.MedicalSupply;
            }
            //武器无故障
            else if(this.MGLoad.MGTemplates.findItemsParentsIdById(itemId).length > 0
                && this.MGLoad.MGTemplates.findItemsParentsIdById(itemId).indexOf("5422acb9af1c889c16000029") !== -1) {
                if (itemProps.BaseMalfunctionChance > 0 && itemJson.HeatFactor) {
                    itemProps.BaseMalfunctionChance = 0;
                    itemProps.AllowFeed = false;
                    itemProps.AllowJam = false;
                    itemProps.AllowMisfire = true;
                    itemProps.AllowOverheat = false;
                    itemProps.AllowSlide = false;
                }
                for (let weapons in itemProps) {
                    //武器维修无损耗
                    if (weapons === "MaxRepairDegradation" && itemJson.RepairDegradation) {
                        itemProps[weapons] = 0; //商人
                    }
                    if (weapons === "MaxRepairKitDegradation" && itemJson.RepairDegradation) {
                        itemProps[weapons] = 0; //维修包
                    }
                    if (weapons === "DurabilityBurnModificator" && itemJson.DurabilityBurnModificator) {
                        itemProps.DurabilityBurnModificator = 0;
                    }
                }
            }
            //弹夹容量
            else if (itemParent === "5448bc234bdc2d3c308b4569"
                && itemJson.CartridgesTimes > 0) {
                let Cartridges = itemProps.Cartridges;
                for (let n in Cartridges) {
                    Cartridges[n]._max_count = Cartridges[n]._max_count * itemJson.CartridgesTimes;
                }
            }
            // 优化 T7、夜视仪
            else if (itemParent === "5a2c3a9486f774688b05e574"
                && itemJson.itemOptimize) {
                itemProps = Object.assign(itemProps, itemsDB.GPNVG._props);
            }
            else if (itemParent === "5d21f59b6dbe99052b54ef83"
                && itemJson.itemOptimize) {
                itemProps = Object.assign(itemProps, itemsDB.T7._props);
            }
        }

        let quests:Record<string, IQuest> = MGTemplates.getQuests();
        let repeatableQuests:IRepeatableQuestDatabase = MGTemplates.getRepeatableQuests();

        // 功能：任务免费重置
        if(requestJson.changeCost_cont !== 5000){
            for (let rqt in repeatableQuests.templates) {
                repeatableQuests.templates[rqt].changeCost[0].count = requestJson.changeCost_cont; //默认5000
            }
        }
        // 功能：任务优化
        if(requestJson.questOptimize){
            for(let qusetId in quests){
                let AForFinish:IQuestCondition[] = quests[qusetId].conditions.AvailableForFinish;
                for(let Finish of AForFinish){
                    Finish.value = 1;
                }
                let AForStart:IQuestCondition[] = quests[qusetId].conditions.AvailableForStart;
                for(let Start of AForStart){
                    Start.availableAfter = 0;
                }
            }
        }
        this.outPut.classLoaded("[MG-Mod][TemplatesServices]");

    }

    private TradersServices(MGTraders:MGTraders,ConfigJson:MGModConfig):void {
        const traderJson = ConfigJson.traders;
        const returnPay =ConfigJson.configs.returnChance.returnPay;

        let traders:Record<string, ITrader> = MGTraders.getTraders();
        for (let tra in traders) {
            let traB:ITraderBase = traders[tra].base;
            if (tra == "ragfair") {continue;}

            if ("availability" in traB.insurance && traB.insurance.availability === true) {
                // 功能：回保速度
                traB.insurance.min_return_hour = traderJson.insurance.min_return_hour;
                traB.insurance.max_return_hour = traderJson.insurance.max_return_hour;
                // 功能：投保费用
                if (returnPay !== "default") {
                    for(let index in traB.loyaltyLevels){
                        traB.loyaltyLevels[index].insurance_price_coef = returnPay * 100;
                    }
                }
            }
        }

        this.outPut.classLoaded("[MG-Mod][TradersServices]");
    }

    private CustomTraderServices(ConfigJson:MGModConfig):void {
        const TraderConfig:any = ConfigJson.MGTrader;
        if (!TraderConfig.enable) {
            return;
        }

        const customTraderService:CustomTraderService = new CustomTraderService(this.mod, this.MGLoad);
        // 独立商人
        customTraderService.start();
    }

    private CustomItemsServices(ConfigJson:MGModConfig):void {
        const TraderConfig:any = ConfigJson.MGTrader;
        if(!TraderConfig.enable) {
            return;
        }
        const customItemsService:CustomItemsService = new CustomItemsService(this.mod,this.MGLoad);
        // 独立物品
        if(TraderConfig.addItems) {
            customItemsService.start();
        }
        // 独立预设
        if(TraderConfig.addAssorts) {
            customItemsService.addMGAssortToServer()
        }
    }

}