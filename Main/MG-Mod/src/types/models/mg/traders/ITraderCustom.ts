import {AnyInfo, ItemsDesc, QuestDesc, TraderDesc, TraderInfo} from "../locales/GlobalInfo";
import {ISuit, ITraderAssort, ITraderLoyaltyLevel} from "@spt/models/eft/common/tables/ITrader";
import {MinMax} from "@spt/models/common/MinMax";
import {IItem} from "@spt/models/eft/common/tables/IItem";
import {ITraderServiceModel} from "@spt/models/spt/services/ITraderServiceModel";
import {CustomTraderItems} from "../items/EItems";
import {ITemplateItem} from "@spt/models/eft/common/tables/ITemplateItem";
import {IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {IQuest} from "@spt/models/eft/common/tables/IQuest";
import {ITraderGlobals} from "../globals/ITraderGlobals";
import {IPreset} from "@spt/models/eft/common/IGlobals";

export interface ICustomTrader{
    images?:CustomTraderImages;
    items?:Record<string, CustomTraderItems>;
    locales?:CustomTraderLocales;
    templates?:CustomTraderTemplates;
    traderData?:CustomTraderData;
    globals?:CustomTraderGlobals;
    traderInfo:CustomTraderInfo;
}

export interface CustomTraderImages{
    quests:any;
    [key:string]:any;
}

export interface CustomTraderLocales{
    itemsdescription:Record<string, ItemsDesc>;
    mail:Record<string, CustomTraderMail>;
}

export interface CustomTraderMail extends QuestDesc{
    other?:{
        [key: string]: string;
    }
}

export interface CustomTraderTemplates {
    db?:Record<string, ITemplateItem>;
    handbook?:IHandbookItem[];
    quests?:Record<string, IQuest>;
    randomContainer?:any
}

export interface CustomTraderData {
    assort?: ITraderAssort;
    questassort?: Record<string, Record<string, string>>;
    suits?: ISuit[];
    services?: ITraderServiceModel[];
}

export interface CustomTraderGlobals extends ITraderGlobals {
    ItemPresets?:Record<string, IPreset>;
}

export interface CustomTraderInfo {
    enable: boolean;
    _id: string;
    locales: TraderDesc;
    insurance: CustomTraderInsurance;
    repair: CustomTraderRepair;
    loyaltyLevels: CustomTraderLoyaltyLevel;
    discount: number;
    medic: boolean;
    updateTime: MinMax;
    unlockedDefault: boolean;
}

export interface CustomTraderInsurance {
    enabled: boolean;
    minreturnTime: number;
    maxreturnTime: number;
    pay: number;
    chance: number;
    storageTime: number;
    Message: Dialogue;
}

export interface Dialogue {
    insuranceStart: string[];
    insuranceFound: string[];
    insuranceFailed: string[];
    insuranceExpired: string[];
    insuranceComplete: string[];
    insuranceFailedLabs: string[];
}

export interface CustomTraderRepair {
    enabled: boolean;
    coefficient: number;
    quality: number | string;
}

export interface CustomTraderLoyaltyLevel {
    description?: AnyInfo
    range: ITraderLoyaltyLevel[]
}

export interface CustomAssort{
    assort:IItem[]
    price:number;
    loyal_level_items:number;
    currency:string;
}