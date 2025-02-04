import {IClone} from "../utils/IClone";
import {PathTypes} from "../models/enums/PathTypes";
import {BrothersItem, MGItems, SuperItem} from "../models/mg/items/EItems";
import {Mod} from "../../mod";
import {CustomTraderAssort} from "../models/mg/traders/ITraderCustom";
import {Money} from "@spt/models/enums/Money";
import {IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {ItemsInfo} from "../models/mg/locales/GlobalInfo";
import {Traders} from "@spt/models/enums/Traders";
import {loadMod} from "../loadMod";
import {OutputService} from "./OutputService";
import {MGLocales} from "../servers/MGLocales";

export class CustomItemsService{

    private mod:Mod
    private MGLoad:loadMod;
    private outPut:OutputService;
    private Locales:MGLocales;
    private IClone: IClone;

    constructor(mod: Mod, MGLoad: loadMod) {
        this.mod = mod;
        this.MGLoad = MGLoad;
        this.outPut = this.MGLoad.Output;
        this.Locales = this.MGLoad.MGLocales;
        this.IClone = new IClone(this.mod);
    }

    public start():void {
        const MGItemsList: Record<string, MGItems> = this.getAllItems();
        this.addMGItemsToServer(MGItemsList);
    }

    private getAllItems(): Record<string, MGItems>{
        const SuperItemsList: Record<string, SuperItem> | any = this.IClone.clone(PathTypes.SuperItemPath);
        this.SuperItemsToMG(SuperItemsList);
        const BrothersItemsList: Record<string, BrothersItem> | any = this.IClone.clone(PathTypes.BrothersItemPath);
        this.brotersItemsToMG(BrothersItemsList);
        let MGItemsList: Record<string, MGItems> | any = this.IClone.clone(PathTypes.MGItemPath);
        this.transferMGItemsStruct(MGItemsList);
        MGItemsList = this.IClone.clone(PathTypes.MGItemPath) as Record<string, MGItems>;
        return MGItemsList;
    }

    private SuperItemsToMG(ItemsList: Record<string, SuperItem> | any): void {
        const superItem:string[] = ["tpl", "items", "handbook"];
        for(let it in ItemsList){
            let item:SuperItem = ItemsList[it];
            let errKey:string[] = [];
            for(let key in superItem){
                if(!(key in item)){
                    errKey.push(key);
                }
            }
            if(errKey.length > 0){
                this.outPut.warning(`超模独立物品：${it}缺少必要字段:${errKey},请重新检查格式。`);
                continue;
            }
            let newItem:MGItems = {
                items:{
                    newId:"",
                    cloneId:"",
                    _props:{}
                },
                price:0,
                description:{
                    name: "",
                    shortName: "",
                    description: ""
                }
            };
            newItem.items.newId = item.items._id;
            newItem.items.cloneId = item.tpl;
            newItem.items._props = item.items._props;
            newItem.price = item.handbook.Price;
            newItem.description = {
                name:item.items._props.Name || "unKnown",
                shortName:item.items._props.ShortName || "unKnown",
                description:item.items._props.Description || "unKnown",
            };
            if("assort" in item){
                newItem.assort = item.assort;
            }
            if("Buffs" in item){
                newItem.Buffs = item.Buffs;
            }
            this.mod.VFS.writeFile(`${this.mod.modpath + PathTypes.MGItemPath}${it}-super.json`, JSON.stringify(newItem, null, 4));
            this.mod.VFS.removeFile(`${this.mod.modpath + PathTypes.SuperItemPath}${it}.json`);
        }

    }

    private brotersItemsToMG(ItemsList: Record<string, BrothersItem> | any): void {
        const broItem = ["newId", "itemTplToClone", "overrideProperties", "locales"];
        for (let it in ItemsList) {
            let item: BrothersItem | any = ItemsList[it];
            let errorKey: string[] = [];
            for (let bI in broItem) {
                if (!(broItem[bI] in item)) {
                    errorKey.push(broItem[bI]);
                }
            }
            if (errorKey.length > 0) {
                this.outPut.warning(`三兄贵独立物品：${it}缺少必要字段:${errorKey},请重新检查格式。`);
                continue;
            }
            let newitem:MGItems = {
                items:{
                    newId:"",
                    cloneId:"",
                    _props:{}
                },
                price:0,
                description:{
                    name: "",
                    shortName: "",
                    description: ""
                }
            };
            newitem.items.newId = item.newId;
            newitem.items.cloneId = item.itemTplToClone;
            newitem.items._props = item.overrideProperties;
            newitem.price = item.fleaPriceRoubles || item.overrideProperties.CreditsPrice || 10000;
            newitem.description = {
                name: item.locales.ch.name || "unknown",
                shortName: item.locales.ch.shortName || "unknown",
                description: item.locales.ch.description || "unknown"
            };
            if ("Buffs" in item && item.Buffs) {
                newitem.Buffs = item.Buffs;
            }
            this.mod.VFS.writeFile(`${this.mod.modpath + PathTypes.MGItemPath}${it}-bro.json`, JSON.stringify(newitem, null, 4));
            this.mod.VFS.removeFile(this.mod.modpath + PathTypes.BrothersItemPath + `${it}.json`);
        }
    }

    private addMGItemsToServer(MGItemsList: Record<string, MGItems>): void {
        for(let it in MGItemsList){
            let item:MGItems = MGItemsList[it];
            let resp:[boolean, string[]] = this.dectectMGItemKey(item);
            if(resp[0]){
                this.outPut.warning(`MG独立物品:${it}.json 缺少关键属性：${resp[1]}`);
                continue;
            }
            if(this.MGLoad.MGTemplates.isInItems(item.items.newId)){
                this.outPut.warning(`MG独立物品:${it}.json的newId已存在于items.json中，请修改newId。`);
                continue;
            }
            // 使用SPT的方法添加独立物品的各项信息
            this.MGLoad.MGTemplates.addMGCustomItem(item);
            // 向指定商人添加出售信息
            if(item.isSold){
                const customAssort:CustomTraderAssort = this.MGLoad.MGTraders.creatCustomItemAssort(item, item.toTraderId);
                this.MGLoad.MGTraders.addAssortToTrader(customAssort);
            }

            // 检验是否在各个部分都存在此物品的信息 若不存在则手动添加
            // handbook.json
            if(!this.MGLoad.MGTemplates.findIdFromHandbookItems(item.items.newId)){
                const parentId:string = this.MGLoad.MGTemplates.findHandbookItemsParentIdById(item.items.cloneId);
                const hbItem:IHandbookItem = {
                    Id:item.items.newId,
                    ParentId:parentId,
                    Price:item.price
                };
                this.MGLoad.MGTemplates.addHandbookItem(hbItem);
            }
            // price.json
            if(this.MGLoad.MGTemplates.findPrice(item.items.newId) === -1){
                this.MGLoad.MGTemplates.addPrice(item.items.newId,item.price);
            }
            // locales/global/xx.json
            if(!(
                this.Locales.getItemInfoFromSpecificLanguage(item.items.newId, "ch").Name !== ""
                && this.Locales.getItemInfoFromSpecificLanguage(item.items.newId, "ch").ShortName !== ""
                && this.Locales.getItemInfoFromSpecificLanguage(item.items.newId, "ch").Description !== ""
            )){
                const itemInfo:ItemsInfo = {
                    _id: item.items.newId,
                    desc: {
                        Name: item.description.name,
                        ShortName: item.description.shortName,
                        Description: item.description.description
                    }
                };
                this.Locales.addItemInfo(itemInfo);
            }

            if(item.Buffs){
                this.MGLoad.MGGlobals.addNewBuffs(item.Buffs);
            }
            this.outPut.addItemsSuccess(it,this.Locales.getTraderNicknameByIdFromSpecificLanguage(item.toTraderId,"ch"));
        }
    }

    private getMGAssorts():Record<string, CustomTraderAssort>{
        return this.IClone.clone(PathTypes.AssortItemPath);
    }

    public addMGAssortToServer():void {
        const MGAssorts:Record<string, CustomTraderAssort> = this.getMGAssorts();
        for(let assortName in MGAssorts){
            let assort:CustomTraderAssort = MGAssorts[assortName];
            assort.assort = this.MGLoad.MGTraders.fixAssort(assort.assort);
            if(!("traderId" in assort)){
                assort.traderId = Traders["MarecGents"];
            }
            if(!("currency" in assort)){
                assort.currency = Money.ROUBLES;
            }
            this.MGLoad.MGTraders.addAssortToTrader(assort);
            this.outPut.addMGAssortSuccess(assortName);
        }
    }

    // basically this function's input is based on MGItems from MGItem folder
    private transferMGItemsStruct(itemList: Record<string, MGItems> | any): void {
        const keyName: string[] = ['Buffs', 'toTraderId', 'isSold', 'loyal_level', 'assort','currency']
        const value: any[] = [{}, '8ef5b2eff000000000000000', true, 1, [],Money.ROUBLES];
        for (let it in itemList) {
            let item: MGItems | any = itemList[it];
            let resp:[boolean, string[]] = this.dectectMGItemKey(item);
            if (resp[0]) {
                this.outPut.warning(`MG独立物品:${it}.json 缺少关键属性：${resp[1]}`);
                continue;
            }
            let creatTimes:number = 0;
            for (let key in keyName) {
                let ifCreat:boolean = false;
                [item, ifCreat] = this.creatNewKey(item, keyName[key], value[key]);
                if (ifCreat) {
                    creatTimes++;
                }
            }
            if (creatTimes > 0) {
                this.mod.VFS.removeFile(`${this.mod.modpath + PathTypes.MGItemPath}${it}.json`);
                this.mod.VFS.writeFile(`${this.mod.modpath + PathTypes.MGItemPath}${it}.json`, JSON.stringify(item, null, 4));
            }
        }
    }

    private creatNewKey(items: MGItems, key: string, value: any): [MGItems, boolean] {
        if (key in items) {
            return [items, false];
        }
        items[key] = value;
        return [items, true];
    }

    private dectectMGItemKey(MGItem:MGItems): [boolean, string[]] {
        const bastPropriety: string[] = ["items", "price", "description"];
        let errKey: string[] = [] as string[];
        for (let mustKey in bastPropriety) {
            if (!(bastPropriety[mustKey] in MGItem)) {
                errKey.push(bastPropriety[mustKey]);
            }
        }
        return [errKey.length > 0, errKey];

    }

}