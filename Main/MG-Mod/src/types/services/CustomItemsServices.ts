import {LoadList, MGList} from "../models/mg/services/ILoadList";
import {MGLocales} from "../servers/MGLocales";
import {FormatOutput} from "./FormatOutput";
import {IClone} from "../utils/IClone";
import {PathTypes} from "../models/enums/PathTypes";
import {LogTextColor} from "../../../types/models/spt/logging/LogTextColor";
import {LogBackgroundColor} from "../../../types/models/spt/logging/LogBackgroundColor";
import {BrothersItem, MGItems, SuperItem} from "../models/mg/items/EItems";
import {Mod} from "../../mod";
import {NewItemFromCloneDetails} from "../../../types/models/spt/mod/NewItemDetails";
import {CustomAssort} from "../models/mg/traders/ITraderCustom";
import {Money} from "../../../types/models/enums/Money";
import {IItem} from "../../../types/models/eft/common/tables/IItem";

export class CustomItemsService {

    private loadList: LoadList;
    private mod: any;
    private MGList: MGList;
    private Locales: MGLocales
    private outPut: FormatOutput;

    constructor(mod: Mod, loadList: LoadList) {
        this.mod = mod;
        this.loadList = loadList;
        this.MGList = this.loadList.MGList;
        this.Locales = this.loadList.MGList.MGlocales;
        this.outPut = this.loadList.Output;
        this.start();
    }

    private start() {
        const MGItemsList: Record<string, MGItems> = this.getAllItems();
        this.addMGItemsToServer(MGItemsList);
    }

    private getAllItems(): Record<string, MGItems>{
        const SuperItemsList: Record<string, SuperItem> | any = (new IClone(this.mod)).clone(PathTypes.SuperItemPath);
        this.SuperItemsToMG(SuperItemsList);
        const BrothersItemsList: Record<string, BrothersItem> | any = (new IClone(this.mod)).clone(PathTypes.BrothersItemPath);
        this.brotersItemsToMG(BrothersItemsList);
        let MGItemsList: Record<string, MGItems> | any = (new IClone(this.mod)).clone(PathTypes.MGItemPath);
        this.transferMGItemsStruct(MGItemsList);
        MGItemsList = (new IClone(this.mod)).clone(PathTypes.MGItemPath) as Record<string, MGItems>;
        return MGItemsList;
    }

    private SuperItemsToMG(ItemsList: Record<string, SuperItem> | any): void {
        const superItem = ["tpl", "items", "handbook"];
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
            if(this.MGList.MGtemplates.isInItems(item.items.newId)){
                this.outPut.warning(`MG独立物品:${it}.json的newId已存在于items.json中，请修改newId。`);
                continue;
            }
            // 使用SPT的方法添加独立物品的各项信息
            this.MGList.MGtemplates.addMGCustomItem(item);
            // 向指定商人添加出售信息
            if(item.isSold){
                const customAssort:CustomAssort = this.MGList.MGtraders.creatCustomItemAssort(item);
                this.MGList.MGtraders.addAssortToTrader(item.toTraderId, customAssort);
            }

            // 检验是否在各个部分都存在此物品的信息 若不存在则手动添加



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
            if (!(mustKey in MGItem)) {
                errKey.push(mustKey);
            }
        }
        return [errKey.length > 0, errKey];

    }

}