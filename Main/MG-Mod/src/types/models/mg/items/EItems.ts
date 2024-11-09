import {IProps} from "@spt/models/eft/common/tables/ITemplateItem";
import {IBuff} from "@spt/models/eft/common/IGlobals";
import {IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {IItem} from "@spt/models/eft/common/tables/IItem";

export interface BrothersItem {
    newId:string
    itemTplToClone:string
    overrideProperties:IProps
    fleaPriceRoubles?:number
    locales:BroLocal
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
    Buffs?:IBuff[]
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
    Buffs?:MGBuff
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

export interface MGBuff {
    [key:string]:IBuff[]
}
