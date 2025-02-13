import {AnyInfo, ItemsDesc, QuestDesc, TraderDesc} from "../locales/GlobalInfo";
import {
    IBarterScheme,
    ISuit,
    ITraderAssort,
    ITraderBase,
    ITraderLoyaltyLevel
} from "@spt/models/eft/common/tables/ITrader";
import {MinMax} from "@spt/models/common/MinMax";
import {IItem} from "@spt/models/eft/common/tables/IItem";
import {ITraderServiceModel} from "@spt/models/spt/services/ITraderServiceModel";
import {CustomTraderItems} from "../items/EItems";
import {ITemplateItem} from "@spt/models/eft/common/tables/ITemplateItem";
import {IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {IQuest} from "@spt/models/eft/common/tables/IQuest";
import {ITraderGlobals} from "../globals/ITraderGlobals";
import {IPreset} from "@spt/models/eft/common/IGlobals";
import {IBundleManifest} from "@spt/loaders/BundleLoader";
import {ILooseLoot} from "../location/ILooseLoot";

export interface ICustomTrader{
    images?:CustomTraderImages;
    items?:Record<string, CustomTraderItems>;
    locales?:CustomTraderLocales;
    templates?:CustomTraderTemplates;
    location?:CustomLooseLoot;
    traderData?:CustomTraderData;
    globals?:CustomTraderGlobals;
    traderInfo:CustomTraderInfo;
    bundles?: IBundleManifest;
}

export interface CustomTraderImages{
    quests:any;
    [key:string]:any;
}

export interface CustomTraderLocales{
    itemsdescription:Record<string, ItemsDesc>;
    mail:Record<string, QuestDesc>;
}

export interface CustomTraderTemplates {
    db?:Record<string, ITemplateItem>;
    handbook?:IHandbookItem[];
    quests?:Record<string, IQuest>;
    randomContainer?:any
}

export interface CustomTraderData {
    base?:ITraderBase;
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
    name:string;
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
    enable: boolean;
    minreturnTime: number;
    maxreturnTime: number;
    pay: number;
    chance: number;
    storageTime: number;
    Message: Record<string, string[]>;
}

export interface CustomTraderRepair {
    enabled: boolean;
    coefficient: number;
    quality: number;
}

export interface CustomTraderLoyaltyLevel {
    description?: AnyInfo
    range: ITraderLoyaltyLevel[]
}

export interface CustomTraderAssort {
    assort:IItem[]
    price:number;
    loyal_level_items:number;
    currency?:string;
    traderId?:string;
}

export interface ITraderAssort {
    nextResupply?: number;
    items: IItem[];
    barter_scheme: Record<string, IBarterScheme[][]>;
    loyal_level_items: Record<string, number>;
}

export interface CustomLooseLoot{
    looseLoot:{
        [MapName:string]:ILooseLoot;
    };
}
