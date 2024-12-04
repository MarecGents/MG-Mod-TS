import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LoadList} from "../models/mg/services/ILoadList";
import {IAchievement} from "@spt/models/eft/common/tables/IAchievement";
import {ICustomizationItem} from "@spt/models/eft/common/tables/ICustomizationItem";
import {IHandbookBase, IHandbookCategory, IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {ITemplateItem} from "@spt/models/eft/common/tables/ITemplateItem";
import {IProfileSides, IProfileTemplates} from "@spt/models/eft/common/tables/IProfileTemplate";
import {IQuest} from "@spt/models/eft/common/tables/IQuest";
import {ILocationServices} from "@spt/models/eft/common/tables/ILocationServices";
import {ItemFilterList} from "../models/mg/items/ItemFilterList";
import {NewItemFromCloneDetails} from "@spt/models/spt/mod/NewItemDetails";
import {CustomItemService} from "@spt/services/mod/CustomItemService";
import {ICustomProfile, IMGSingleProfile} from "../models/mg/profiles/ICustomProfile";
import {CustomTraderItems} from "../models/mg/items/EItems";

export class MGTemplates extends CommonlLoad {

    protected databaseService: DatabaseService;
    protected loadList: LoadList;

    constructor(mod: any) {
        super(mod);
    }

    public init() {
        this.className = "MGTemplates";
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
            this.valueHelper = this.loadList.ValueHelper;
        }
    }

    public getAchievements(): IAchievement[] {
        return this.databaseService.getAchievements();
    }

    public getCustomization(): Record<string, ICustomizationItem> {
        return this.databaseService.getCustomization();
    }

    public getHandbook(): IHandbookBase {
        return this.databaseService.getHandbook();
    }

    public getItems(): Record<string, ITemplateItem> {
        return this.databaseService.getItems();
    }

    public getPrices(): Record<string, number> {
        return this.databaseService.getPrices();
    }

    public getProfiles(): ICustomProfile {
        return this.databaseService.getProfiles();
    }

    public getQuests(): Record<string, IQuest> {
        return this.databaseService.getQuests();
    }

    public getLocationServices(): ILocationServices {
        return this.databaseService.getLocationServices();
    }

    /**
     * @description items.json add or change
     */

    public addFilterToDB(newItemList: ItemFilterList) {
        let itemsDB = this.getItems();
        const FilterList = ["StackSlots", "Slots", "Chambers", "Cartridges", "Grids"];
        for (const item in itemsDB) {
            for (const types in FilterList) {
                const tp = FilterList[types];
                if (itemsDB[item]._props[tp] && itemsDB[item]._props[tp].length > 0) {
                    for (const type in itemsDB[item]._props[tp]) {
                        if (itemsDB[item]._props[tp][type]._props.filters.length > 0) {
                            let idList = itemsDB[item]._props[tp][type]._props.filters[0].Filter
                            for (let nId in newItemList) {
                                let keyId = newItemList[nId].filterId;
                                if (idList.includes(keyId) && !idList.includes(nId)) {
                                    itemsDB[item]._props[tp][type]._props.filters[0].Filter.push(nId);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public addItem(id:string,item:ITemplateItem) {
        let itemDB = this.getItems();
        if(id !== item._id){
            this.output.warning(`物品id：${id} 与其 _id:${item._id} 不一致，请检查并更改使其保持一致！`);
            return;
        }
        if(id in item){
            itemDB[id] = item;
            this.output.log(`物品:id为${id}，已进行替换。`,"cyan");
            return;
        }
        itemDB[id] = item;
        this.output.log(`物品：id为${id}，已添加。`,"white");
        return;
    }

    public addCustomItem(newItem:NewItemFromCloneDetails){
        // let CustomItemService = this.mod.container.resolve<CustomItemService>("CustomItemService");
        (new CustomItemService()).createItemFromClone(newItem);
    }

    public addCustomItems(newItemList:NewItemFromCloneDetails[]){
        newItemList.forEach(newItem => this.addCustomItem(newItem))
    }

    public AddCustomTraderItem(newItem:CustomTraderItems){
        let itemDB = this.getItems();
        let itemTemplate:ITemplateItem={};
        if(!newItem.item){
            return this.output.warning("存在自定义商人独立物品信息缺失，请自行检查！");
        }
        itemTemplate = newItem.item;
        const itemId = itemTemplate._id;
        if(!newItem.origin){
            return this.output.warning(`自定义商人独立物品缺少originId，物品id:${itemId}`);
        }

        itemDB[itemId] = itemTemplate;
        let filter :ItemFilterList = {};
        filter[itemId] = {filterId:newItem.origin};
        this.addFilterToDB(filter);
    }

    /**
     * @description HandBook add or change
     */

    public addHandbookCategory(Category: IHandbookCategory) {
        let HBCategory: IHandbookCategory[] = this.getHandbook().Categories;
        let index = -1;
        for (let it in HBCategory) {
            if (HBCategory[it].Id === Category.Id) {
                HBCategory[it] = Category;
                index = parseInt(it);
                return;
            }
        }
        HBCategory.push(Category);
        return;

    }

    public addHandbookCategories(Categories: IHandbookCategory[]) {
        Categories.forEach(value => this.addHandbookCategory(value));
        return;
    }

    public addHandbookItem(Item: IHandbookItem) {
        let HBItem: IHandbookItem[] = this.getHandbook().Items;
        let index = -1;
        for (let it in HBItem) {
            if (HBItem[it].Id === Item.Id) {
                HBItem[it] = Item;
                index = parseInt(it);
                return;
            }
        }
        HBItem.push(Item);
        return;
    }

    public addHandbookItems(ItemList: IHandbookItem[]) {
        ItemList.forEach(value => this.addHandbookItem(value));
    }

    public findHandbookParentIdById(itemId:string):string{
        let HBItem: IHandbookItem[] = this.getHandbook().Items;
        for(let it in HBItem) {
            if(HBItem[it].Id !== itemId){
                continue;
            }
            return HBItem[it].ParentId;
        }
        return "null";
    }

    /**
     * @description quests.json add or change
     */

    public CustomQuest(id:string,quest: IQuest) {
        let Quest:Record<string,IQuest> = this.getQuests();
        if(id !== quest._id){
            this.output.log(`自定义任务id:${id} 与其 _id:${quest._id} 不一致. 请重新核对！`,"red");
            return;
        }
        if(id in Quest || quest._id in Quest){
            this.output.warning(`自定义任务id: ${quest._id} 已存在，请更换其他id`);
            return;
        }
        Quest[id] = quest;
        return;
    }

    public CustomQuests(quests: Record<string,IQuest>) {
        return Object.keys(quests).forEach(id => this.CustomQuest(id, quests[id]));
    }


    /**
     * @description prices.json add or change
     */

    public c_priceById(id:string,price:number){
        let prices = this.getPrices();
        if(id in prices){
            prices[id] = prices[id];
        } else {
            this.output.log(`prices.json中未找到物品：id为${id}`,"red");
        }
    }

    public c_PricesByIds(priceList:Record<string,number>){
        Object.keys(priceList).forEach(id => {this.c_priceById(id,priceList[id])});
    }

    /**
     * @description profile.json add or change
     */

    public addProfile(profile:IMGSingleProfile){
        let profiles:ICustomProfile=this.getProfiles();
        profiles[profile.profileName] = profile.profileSides;
        let desc = {};
        desc[profile.profileSides.descriptionLocaleKey] = profile.description;
        this.loadList.MGList.MGlocales.addProfileInfo(desc);
    }

    public addProfiles(profiles:IMGSingleProfile[]){
        profiles.forEach(profile => this.addProfile(profile));
    }

}