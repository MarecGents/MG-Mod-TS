import {DatabaseService} from "@spt/services/DatabaseService";
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
import {loadMod} from "../loadMod";
import {AnyInfo} from "../models/mg/locales/GlobalInfo";
import {IFileControl} from "../utils/IFileControl";
import {ConfigTypes} from "@spt/models/enums/ConfigTypes";
import {ILocaleConfig} from "@spt/models/spt/config/ILocaleConfig";

export class MGTemplates {

    private mod:Mod
    private className:string;
    private MGLoad:loadMod;
    private databaseService: DatabaseService;

    constructor(mod: Mod, MGLoad:loadMod) {
        this.mod = mod;
        this.className = "MGLocales";
        this.MGLoad = MGLoad;
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
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
        const Items:ITemplateItem = this.getItems();
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

    public addFiltersToDB(newItemList: ItemFilterList):void {
        let itemsDB:Record<string, ITemplateItem> = this.getItems();
        const FilterList:string[] = ["StackSlots", "Slots", "Chambers", "Cartridges", "Grids"];
        for (const item in itemsDB) {
            for (const types in FilterList) {
                const tp :string= FilterList[types];
                if (itemsDB[item]._props[tp] && itemsDB[item]._props[tp].length > 0) {
                    for (const type in itemsDB[item]._props[tp]) {
                        if (itemsDB[item]._props[tp][type]._props.filters.length > 0) {
                            let idList = itemsDB[item]._props[tp][type]._props.filters[0].Filter
                            for (let nId in newItemList) {
                                let keyId:string = newItemList[nId].filterId;
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

    public addItem(id:string,item:ITemplateItem):void {
        let itemDB = this.getItems();
        if(id !== item._id){
            this.MGLoad.Output.warning(`物品id：${id} 与其 _id:${item._id} 不一致，请检查并更改使其保持一致！`);
            return;
        }
        if(id in itemDB){
            itemDB[id] = item;
            this.MGLoad.Output.log(`物品:id为${id}，已进行替换。`,"cyan");
            return;
        }
        itemDB[id] = item;
        this.MGLoad.Output.log(`物品id:${id}，已添加。`,"white");
        return;
    }

    public addCustomItem(newItem:NewItemFromCloneDetails):void {
        const CustomItemService:CustomItemService = this.mod.container.resolve<CustomItemService>("CustomItemService");
        CustomItemService.createItemFromClone(newItem);
    }

    public addCustomItems(newItemList:NewItemFromCloneDetails[]):void {
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
            this.MGLoad.Output.warning(`MG独立物品id为${MGItem.items.newId}的\"cloneId\"未能在items.json中找到，无法添加到游戏中，请检查\"cloneId\"是否正确！`);
            return;
        }
        NewItemDetails.parentId = this.findItemsParentIdById(MGItem.items.cloneId);
        if(this.findHandbookItemsParentIdById(MGItem.items.cloneId) === "null"){
            this.MGLoad.Output.warning(`MG独立物品id为${MGItem.items.newId}的\"cloneId\"未能在handbook.json中找到，无法添加到游戏中，请检查\"cloneId\"是否正确！`);
            return;
        }
        if((new IFormatUtils()).isMongoId(MGItem.items.newId) === false){
            this.MGLoad.Output.warning(`MG独立物品id为${MGItem.items.newId}的\"newId\"不符合MongoId格式，建议修改newId。如果你安装了忽视MongoId的mod，请忽视此警告消息。`);
        }
        NewItemDetails.handbookParentId = this.findHandbookItemsParentIdById(MGItem.items.cloneId);
        NewItemDetails.locales = {
            ch:MGItem.description
        }
        this.addCustomItem(NewItemDetails);
    }

    public addCustomTraderItem(newItem:CustomTraderItems){
        let itemDB:Record<string,ITemplateItem> = this.getItems();
        let itemTemplate:ITemplateItem={};
        if(!newItem.item){
            this.MGLoad.Output.warning("自定义商人独立物品信息缺失，请自行检查！");
            return;
        }
        itemTemplate = newItem.item;
        const itemId:string = itemTemplate._id;
        // if(!newItem.origin){
        //     return this.MGLoad.Output.warning(`自定义商人独立物品缺少originId，物品id:${itemId}`);
        // }
        itemDB[itemId] = itemTemplate;
        if(!!newItem.origin){
            let filter :ItemFilterList = {};
            filter[itemId] = {filterId:newItem.origin};
            this.addFiltersToDB(filter);
        }
    }

    /**
     * @description handbook.json add or change
     */

    public addHandbookCategory(Category: IHandbookCategory):void {
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

    public addHandbookCategories(Categories: IHandbookCategory[]):void {
        Categories.forEach((value:IHandbookCategory) => this.addHandbookCategory(value));
        return;
    }

    public addHandbookItem(Item: IHandbookItem):void {
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

    public addHandbookItems(ItemList: IHandbookItem[]):void {
        ItemList.forEach((value:IHandbookItem):void => this.addHandbookItem(value));
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

    public addCustomQuest(id:string,quest: IQuest):void {
        let Quest:Record<string,IQuest> = this.getQuests();
        if(id !== quest._id){
            this.MGLoad.Output.warning(`自定义任务id:${id} 与其 _id:${quest._id} 不一致. 请重新核对！`);
            return;
        }
        if(id in Quest || quest._id in Quest){
            this.MGLoad.Output.warning(`自定义任务id: ${quest._id} 已存在，请更换其他id`);
            return;
        }
        Quest[id] = quest;
        return;
    }

    public addCustomQuests(quests: Record<string,IQuest>):void {
        if(quests){
            Object.keys(quests).forEach((id:string):void => this.addCustomQuest(id, quests[id]));
        }
    }


    /**
     * @description prices.json add or change
     */

    public findPrice(Id:string):number{
        const prices:Record<string, number> = this.getPrices();
        if(Id in prices){
            return prices[Id];
        }
        return -1;
    }
    
    public addPrice(Id:string, price:number):void{
        const prices:Record<string, number> = this.getPrices();
        prices[Id] = price;
    }
    
    public c_priceById(id:string,price:number){
        let prices:Record<string, number> = this.getPrices();
        if(id in prices){
            prices[id] = prices[id];
        } else {
            this.MGLoad.Output.log(`prices.json中未找到物品：id为${id}`,"red");
        }
    }

    public addPrices(priceList:Record<string,number>):void {
        const prices:Record<string, number> = this.getPrices();
        if(priceList){
            Object.keys(priceList).forEach((id:string):void => {
                prices[id] = priceList[id];
            });
        }
    }

    /**
     * @description profile.json add or change
     */

    public addProfile(profile:IMGSingleProfile):void {
        let profiles:ICustomProfile=this.getProfiles();
        profiles[profile.profileName] = profile.profileSides;
        let desc:AnyInfo = {} as AnyInfo;
        desc[profile.profileSides.descriptionLocaleKey] = profile.description;
        this.MGLoad.MGLocales.addProfileInfo(desc);
        const FileControl:IFileControl = new IFileControl(this.mod);
        const localeConfig:ILocaleConfig = this.MGLoad.MGConfigs.getConfig(ConfigTypes.LOCALE);
        for(let it in localeConfig.serverSupportedLocales){
            let lang:string = localeConfig.serverSupportedLocales[it];
            let serverPath:string = this.mod.modpath + `../../../SPT_Data/Server/database/locales/server/${lang}.json`;
            let langFile:Record<string, string> =  JSON.parse(FileControl.readFile(serverPath));
            langFile[profile.profileSides.descriptionLocaleKey] = profile.description;
            FileControl.writeFile(serverPath, JSON.stringify(langFile, null, 4));
        }
    }

    public addProfiles(profiles:IMGSingleProfile[]):void {
        profiles.forEach((profile:IMGSingleProfile):void => {this.addProfile(profile)});
    }

    public addTraderInitialLoyaltyLevel(traderId:string, level:number = 1):void {
        let profiles:ICustomProfile=this.getProfiles();
        Object.keys(profiles).forEach((profile:string):void => {
            profiles[profile].bear.trader.initialLoyaltyLevel[traderId] = level;
            profiles[profile].usec.trader.initialLoyaltyLevel[traderId] = level;
        })
    }


}