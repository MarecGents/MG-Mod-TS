import {IProps} from "@spt/models/eft/common/tables/ITemplateItem";

export interface BrothersItem {
    newId:string
    itemTplToClone:string
    overrideProperties:IProps
    fleaPriceRoubles:number
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

