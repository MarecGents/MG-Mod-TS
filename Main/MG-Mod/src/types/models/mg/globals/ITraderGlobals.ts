import {IBuff} from "@spt/models/eft/common/IGlobals";

export interface ITraderGlobals {
    Buffs?: BuffList;
}

export interface BuffList {
    [key: string]: IBuff[];
}