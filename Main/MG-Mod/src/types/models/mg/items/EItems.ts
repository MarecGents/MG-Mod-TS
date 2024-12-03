import { IProps, ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { BuffList, ITraderGlobals } from "../globals/ITraderGlobals";
import { IHandbookItem } from "@spt/models/eft/common/tables/IHandbookBase";
import { IItem } from "@spt/models/eft/common/tables/IItem";

export interface BrothersItem extends ITraderGlobals {
    newId: string;
    itemTplToClone: string;
    overrideProperties: IProps;
    fleaPriceRoubles?: number;
    locales: BroLocal;
}

export interface BroLocal {
    ch: BroCh;
}

export interface BroCh {
    name: string;
    shortName: string;
    description: string;
}

export interface SuperItem extends ITraderGlobals {
    tpl: string;
    items: Superitems;
    handbook?: IHandbookItem;
    assort?: IItem[];
}

export interface Superitems {
    _id: string;
    _name: string;
    _props: IProps;
}

export interface MGItems extends ITraderGlobals {
    items: MGitems;
    price: number;
    description: MGItemDesc;
    toTraderId?: string;
    isSold?: boolean;
    loyal_level?: number;
    assort?: IItem[];
}

export interface MGitems {
    newId: string;
    cloneId: string;
    _props: IProps;
}

export interface MGItemDesc {
    name: string;
    shortName: string;
    description: string;
}

export interface CustomTraderItems {
    item: ITemplateItem;
    origin: string;
    Type: string[];
}
