import {AnyInfo, TraderInfo} from "../locales/GlobalInfo";
import {ITraderLoyaltyLevel} from "@spt/models/eft/common/tables/ITrader";
import {MinMax} from "@spt/models/common/MinMax";
import {IItem} from "@spt/models/eft/common/tables/IItem";
import {Money} from "@spt/models/enums/Money";

export interface CustomTrader extends TraderInfo {
    enabled: boolean;
    // _id locales extended from TraderInfo
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
    currency:Money;
}