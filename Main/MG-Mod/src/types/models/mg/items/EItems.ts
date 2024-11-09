import {IProps, ITemplateItem} from "@spt/models/eft/common/tables/ITemplateItem";
import {BuffList} from "../traders/ITraderGlobals";
import {IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {IItem} from "@spt/models/eft/common/tables/IItem";

export interface BrothersItem {
    newId:string
    itemTplToClone:string
    overrideProperties:IProps
    fleaPriceRoubles?:number
    locales:BroLocal
    Buffs?:BuffList
}

export interface BroLocal {
    ch:BroCh
}

export interface BroCh{
    name:string
    shortName:string
    description:string
}

export interface SuperItem {
    tpl:string
    items:Superitems
    Buffs?:BuffList
    handbook?:IHandbookItem
    assort?:IItem[]
}

export interface Superitems{
    _id:string
    _name:string
    _props:IProps
}

export interface MGItems {
    items:MGitems
    price:number
    description:MGItemDesc
    Buffs?:BuffList
    toTraderId?:string
    isSold?:boolean
    loyal_level?:number
    assort?:IItem[]
}

export interface MGitems {
    newId: string
    cloneId: string
    _props:IProps
}

export interface MGItemDesc {
    name:string
    shortName:string
    description:string
}



export interface CustomTraderItems{
    item:ITemplateItem
    origin:string
    Type:string[]
}
