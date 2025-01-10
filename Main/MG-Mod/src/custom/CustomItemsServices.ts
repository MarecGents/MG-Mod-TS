import {LoadList, MGList} from "../types/models/mg/services/ILoadList";
import {MGLocales} from "../types/services/MGLocales";
import {FormatOutput} from "../types/servers/FormatOutput";
import {IClone} from "../types/utils/IClone";
import {PathTypes} from "../types/models/enums/PathTypes";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LogBackgroundColor} from "@spt/models/spt/logging/LogBackgroundColor";
import {BrothersItem, MGItems, SuperItem} from "../types/models/mg/items/EItems";

export class CustomItemsService {

    private loadList: LoadList;
    private mod: any;
    private MGList: MGList;
    private Locales: MGLocales
    private outPut: FormatOutput;

    constructor(mod: any, loadList: LoadList) {
        this.mod = mod;
        this.loadList = loadList;

        this.MGList = this.loadList.MGList;
        this.Locales = this.loadList.MGList.MGlocales;
        this.outPut = this.loadList.Output;
        this.start();
    }

    public start() {
        const MGItemsList: Record<string, MGItems> | any = this.getAllItems();
        this.addMGItemsToServer(MGItemsList);
    }

    private getAllItems(): Record<string, MGItems> | any {
        const SuperItemsList: Record<string, SuperItem> | any = (new IClone(this.mod)).clone(PathTypes.SuperItemPath);
        this.SuperItemsToMG(SuperItemsList);
        const BrothersItemsList: Record<string, BrothersItem> | any = (new IClone(this.mod)).clone(PathTypes.BrothersItemPath);
        this.brotersItemsToMG(BrothersItemsList);
        let MGItemsList: Record<string, MGItems> | any = (new IClone(this.mod)).clone(PathTypes.MGItemPath);
        this.transferMGItemsStruct(MGItemsList);
        MGItemsList = (new IClone(this.mod)).clone(PathTypes.MGItemPath) as Record<string, MGItems> | any;
        return MGItemsList;
    }

    private SuperItemsToMG(ItemsList: Record<string, SuperItem> | any): void {

    }

    private brotersItemsToMG(ItemsList: Record<string, BrothersItem> | any): void {
        const broItem = ["newId", "itemTplToClone", "overrideProperties", "locales"];
        for (const it in ItemsList) {
            const item: BrothersItem | any = ItemsList[it];
            let errorKey: string[] = [];
            for (let bI in broItem) {
                if (!(broItem[bI] in item)) {
                    errorKey.push(broItem[bI]);
                }
            }
            if (errorKey.length > 0) {
                this.outPut.log(`三兄贵独立物品：${it}缺少必要字段:${errorKey},请重新检查格式。`, LogTextColor.RED, LogBackgroundColor.CYAN);
                continue;
            }
            let newitem = {
                items: {}
            };
            newitem.items['newId'] = item.newId;
            newitem.items['cloneId'] = item.itemTplToClone;
            newitem.items['_props'] = item.overrideProperties;
            newitem['price'] = item.fleaPriceRoubles || item.overrideProperties.CreditsPrice || 10000;
            newitem["description"] = {
                "name": item.locales.ch.name || "unknown",
                "shortName": item.locales.ch.shortName || "unknown",
                "description": item.locales.ch.description || "unknown"
            };
            if ("Buffs" in item && item.Buffs) {
                newitem['Buffs'] = item.Buffs;
            }
            this.mod.VFS.writeFile(`${this.mod.modpath + PathTypes.MGItemPath}${it}-bro.json`, JSON.stringify(newitem, null, 4));
            this.mod.VFS.removeFile(this.mod.modpath + PathTypes.BrothersItemPath + `${it}.json`);
        }
    }

    private addMGItemsToServer(MGItemsList: Record<string, MGItems> | any): void {

    }


    // basically this function's input is based on MGItems from MGItem folder
    private transferMGItemsStruct(itemList: Record<string, MGItems> | any): void {
        const bastPropriety: string[] = ["items", "price", "description"];
        const keyName: string[] = ['Buffs', 'toTraderId', 'isSold', 'loyal_level', 'assort']
        const value: any[] = [{}, '8ef5b2eff000000000000000', true, 1, []];
        for (let it in itemList) {
            let errKey: string[] = [] as string[];
            for (let mustKey in bastPropriety) {
                if (!(mustKey in itemList)) {
                    errKey.push(mustKey);
                }
            }
            if (errKey.length > 0) {
                this.outPut.warning(`独立物品:${it}.json 缺少关键属性：${errKey}`);
                continue;
            }
            let item: MGItems | any = itemList[it];
            let creatTimes = 0;
            for (let key in keyName) {
                let ifCreat = false;
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

}