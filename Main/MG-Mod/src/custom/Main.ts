import {LoadList, MGList} from "../types/models/mg/services/ILoadList";
import {ValueHepler} from "../types/helpers/ValueHepler";
import {FormatOutput} from "../types/servers/FormatOutput";
import {MGModConfig} from "../types/models/mg/config/IConfig";
import {IClone} from "../types/utils/IClone";
import {PathTypes} from "../types/models/enums/PathTypes";
import {MGBots} from "../types/services/MGBots";
import {MGConfigs} from "../types/services/MGConfigs";
import {ConfigTypes} from "@spt/models/enums/ConfigTypes";

export class Main{
    private loadList:LoadList;
    private mod: any;
    private MGList: MGList;
    private updateValue: ValueHepler;
    private outPut: FormatOutput;
    constructor(mod,loadList:LoadList){
        this.loadList = loadList;
        this.MGList = this.loadList.MGList;
        this.updateValue = this.loadList.ValueHelper;
        this.outPut = this.loadList.Output;
        this.mod = mod;
        this.start();
    }

    public start(){
        const ConfigJson: MGModConfig = new IClone(this.mod).clone(this.mod.modpath + PathTypes.ModConfigList).config;
    }

    private BotsServices(MGBots:MGBots,ConfigJson:MGModConfig){
        const botsJson = ConfigJson.bots;
        // 功能：AI血量
        if(botsJson.healthRate && botsJson.healthRate !== "default"){
            MGBots.c_BotsHeathByRate(botsJson.healthRate)
        }
    }

    private ConfigServices(MGConfigs:MGConfigs,ConfigJson:MGModConfig){
        const configJson = ConfigJson.configs;

        // airdrop.json
        let airdrop = MGConfigs.getConfig(ConfigTypes.AIRDROP);
        // 功能：空投种类
        if (configJson.airdrop.airdropType !== "default") {
            let Type = configJson.airdrop.airdropType;
            let Weight = airdrop.airdropTypeWeightings;
            if (Type === "moreWeapon") {
                Weight.weaponArmor = 12;
            }
            else if (Type === "moreFoodMedical") {
                Weight.foodMedical = 12;
            }
            else if (Type === "moreBarter") {
                Weight.barter = 12;
            }
            else if (Type === "moreMixed") {
                Weight.mixed = 9;
            }
        }
        // backup.json

        // bot.json
        let bot = MGConfigs.getConfig(ConfigTypes.BOT);
        // 功能：AI刷新数量
        if(configJson.botmod.botadd && configJson.botmod.botadd !== 0){
            Object.keys(bot.maxBotCap).forEach(key => {
                bot.maxBotCap[key] += configJson.botmod.botadd;
            });
        }

        // core.json
        // gifts.json
        // health.json
        // hideout.json
        // http.json

        // inraid.json
        let inraid = MGConfigs.getConfig(ConfigTypes.IN_RAID);
        // 功能：战局默认选项
        if(configJson.inraid && configJson.inraid.raidMenuSettings){
            inraid.raidMenuSettings = configJson.inraid.raidMenuSettings;
        }
        // insurance.json

        // inventory.json

        // item.json

        // locale.json

        // location.json

        // loot.json

        // lostondeath.json

        // match.json

        // playerscav.json

        // pmc.json

        // pmcchatresponse.json

        // quest.json

        // ragfair.json

        // repair.json

        // scavcase.json

        // seasonalevents.json

        // trader.json

        // weather.json

    }
}