import {IProps, ITemplateItem} from "@spt/models/eft/common/tables/ITemplateItem";
import {ITraderGlobals} from "../globals/ITraderGlobals";
import {IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {IItem} from "@spt/models/eft/common/tables/IItem";
import {Money} from "@spt/models/enums/Money";
import {LocaleDetails} from "@spt/models/spt/mod/NewItemDetails";

export interface BrothersItem extends ITraderGlobals {
    newId: string;
    itemTplToClone: string;
    overrideProperties: IProps;
    fleaPriceRoubles?: number;
    locales: BroLocal;
}

export interface BroLocal {
    ch: LocaleDetails;
}

export interface SuperItem extends ITraderGlobals {
    tpl: string;
    items: SuperItems;
    handbook: IHandbookItem;
    assort?: IItem[];
}

export interface SuperItems {
    _id: string;
    _name: string;
    _props: IProps;
}

export interface MGItems extends ITraderGlobals {
    items: MGItem;
    price: number;
    description: LocaleDetails;
    toTraderId?: string;
    isSold?: boolean;
    loyal_level?: number;
    assort?: IItem[];
    currency?: Money;
}

export interface MGItem {
    newId: string;
    cloneId: string;
    _props: IProps;
}

export interface CustomTraderItems {
    item: ITemplateItem;
    origin: string;
    Type: string[];
}

export interface configContainer{
    enable:boolean;
    Name:string;
    cellsH:number;
    cellsV:number;
    Weight:boolean;
    Filter:boolean;
}
