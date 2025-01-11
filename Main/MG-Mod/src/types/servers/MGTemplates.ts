import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LoadList} from "../models/mg/services/ILoadList";
import {IAchievement} from "@spt/models/eft/common/tables/IAchievement";
import {ICustomizationItem} from "@spt/models/eft/common/tables/ICustomizationItem";
import {IHandbookBase, IHandbookCategory, IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {ITemplateItem} from "@spt/models/eft/common/tables/ITemplateItem";
import {IQuest} from "@spt/models/eft/common/tables/IQuest";
import {ILocationServices} from "@spt/models/eft/common/tables/ILocationServices";
import {ItemFilterList} from "../models/mg/items/ItemFilterList";
import {NewItemFromCloneDetails} from "@spt/models/spt/mod/NewItemDetails";
import {CustomItemService} from "@spt/services/mod/CustomItemService";
import {ICustomProfile, IMGSingleProfile} from "../models/mg/profiles/ICustomProfile";
import {CustomTraderItems, MGItems} from "../models/mg/items/EItems";
import {ITemplates} from "@spt/models/spt/templates/ITemplates";
import {LocalisationService} from "@spt/services/LocalisationService";
import {IRepeatableQuestDatabase} from "@spt/models/eft/common/tables/IRepeatableQuests";
import {Mod} from "../../mod";
import {IFormatUtils} from "../utils/IFormatUtils";

export class MGTemplates extends CommonlLoad {

    protected databaseService: DatabaseService;
    protected loadList: LoadList;

    constructor(mod: Mod) {
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
        }
    }

    public getTemplates():ITemplates {
        return this.databaseService.getTemplates();
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

    public getRepeatableQuests():IRepeatableQuestDatabase{
        if (!this.getTemplates().repeatableQuests) {
            throw new Error(
                (new LocalisationService()).getText("database-data_at_path_missing", "assets/database/templates"),
            );
        }
        return this.getTemplates().repeatableQuests;
    }

    /**
     * @description items.json add or change
     */

    public isInItems(id:string):boolean {
        const Items:ITemplateItem = this.databaseService.getItems();
        return id in Items;
    }

    public findItemsParentIdById(id:string):string{
        const Items:Record<string, ITemplateItem> = this.getItems();
        if(id in Items){
            return Items[id]._parent;
        }
        return "null";
    }

    public findItemsParentsIdById(Id:string):string[]{
        const Items:Record<string, ITemplateItem> = this.getItems();
        let ParentIds:string[] = [];
        let nowId:string = Id;
        while(Items[nowId]._parent){
            let temp:string = this.findItemsParentIdById(nowId);
            if(temp === "null"){break;}
            ParentIds.push(temp);
            nowId = temp;
        }
        return ParentIds;
    }

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
        this.output.log(`物品id:${id}，已添加。`,"white");
        return;
    }

    public addCustomItem(newItem:NewItemFromCloneDetails){
        // let CustomItemService = this.mod.container.resolve<CustomItemService>("CustomItemService");
        (new CustomItemService()).createItemFromClone(newItem);
    }

    public addCustomItems(newItemList:NewItemFromCloneDetails[]){
        newItemList.forEach(newItem => this.addCustomItem(newItem))
    }

    public addMGCustomItem(MGItem:MGItems):void {
        const NewItemDetails:NewItemFromCloneDetails = {
            fleaPriceRoubles: MGItem.price,
            handbookParentId: "",
            handbookPriceRoubles: MGItem.price,
            itemTplToClone: MGItem.items.cloneId,
            locales: undefined,
            newId: MGItem.items.newId,
            overrideProperties: MGItem.items._props,
            parentId: ""
        }
        if(this.findItemsParentIdById(MGItem.items.cloneId) === "null"){
            this.output.warning(`MG独立物品id为${MGItem.items.newId}的\"cloneId\"未能在items.json中找到，无法添加到游戏中，请检查\"cloneId\"是否正确！`);
            return;
        }
        NewItemDetails.parentId = this.findItemsParentIdById(MGItem.items.cloneId);
        if(this.findHandbookItemsParentIdById(MGItem.items.cloneId) === "null"){
            this.output.warning(`MG独立物品id为${MGItem.items.newId}的\"cloneId\"未能在handbook.json中找到，无法添加到游戏中，请检查\"cloneId\"是否正确！`);
            return;
        }
        if((new IFormatUtils()).isMongoId(MGItem.items.newId) === false){
            this.output.warning(`MG独立物品id为${MGItem.items.newId}的\"newId\"不符合MongoId格式，建议修改newId。如果你安装了忽视MongoId的mod，请忽视此警告消息。`);
        }
        NewItemDetails.handbookParentId = this.findHandbookItemsParentIdById(MGItem.items.cloneId);
        NewItemDetails.locales = {
            ch:MGItem.description
        }
        this.addCustomItem(NewItemDetails);
    }

    public addCustomTraderItem(newItem:CustomTraderItems){
        let itemDB = this.getItems();
        let itemTemplate:ITemplateItem={};
        if(!newItem.item){
            this.output.warning("自定义商人独立物品信息缺失，请自行检查！");
            return;
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
        for (let it in HBCategory) {
            if (HBCategory[it].Id === Category.Id) {
                HBCategory[it] = Category;
                return;
            }
        }
        HBCategory.push(Category);
        return;

    }

    public addHandbookCategories(Categories: IHandbookCategory[]) {
        Categories.forEach((value:IHandbookCategory) => this.addHandbookCategory(value));
        return;
    }

    public addHandbookItem(Item: IHandbookItem) {
        let HBItem: IHandbookItem[] = this.getHandbook().Items;
        for (let it in HBItem) {
            if (HBItem[it].Id === Item.Id) {
                HBItem[it] = Item;
                return;
            }
        }
        HBItem.push(Item);
        return;
    }

    public addHandbookItems(ItemList: IHandbookItem[]) {
        ItemList.forEach((value:IHandbookItem) => this.addHandbookItem(value));
    }

    public findIdFromHandbookItems(Id:string):boolean{
        const HBItem: IHandbookItem[] = this.getHandbook().Items;
        for(let it in HBItem) {
            if(HBItem[it].Id === Id){return true;}
        }
        return false
    }

    public findHandbookItemsParentIdById(itemId:string):string{
        let HBItem: IHandbookItem[] = this.getHandbook().Items;
        for(let it in HBItem) {
            if(HBItem[it].Id === itemId){
                return HBItem[it].ParentId;
            }
        }
        return "null";
    }

    /**
     * @description quests.json add or change
     */

    public addCustomQuest(id:string,quest: IQuest) {
        let Quest:Record<string,IQuest> = this.getQuests();
        if(id !== quest._id){
            this.output.warning(`自定义任务id:${id} 与其 _id:${quest._id} 不一致. 请重新核对！`);
            return;
        }
        if(id in Quest || quest._id in Quest){
            this.output.warning(`自定义任务id: ${quest._id} 已存在，请更换其他id`);
            return;
        }
        Quest[id] = quest;
        return;
    }

    public addCustomQuests(quests: Record<string,IQuest>) {
        return Object.keys(quests).forEach(id => this.addCustomQuest(id, quests[id]));
    }


    /**
     * @description prices.json add or change
     */

    public findPriceById(Id:string):number{
        const prices:Record<string, number> = this.getPrices();
        if(Id in prices){
            return prices[Id];
        }
        return -1;
    }
    
    public addPriceById(Id:string, price:number):void{
        const prices:Record<string, number> = this.getPrices();
        prices[Id] = price;
    }
    
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