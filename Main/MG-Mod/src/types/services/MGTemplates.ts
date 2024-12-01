import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LoadList} from "../models/mg/services/ILoadList";
import {IAchievement} from "@spt/models/eft/common/tables/IAchievement";
import {ICustomizationItem} from "@spt/models/eft/common/tables/ICustomizationItem";
import {IHandbookBase, IHandbookCategory, IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {ITemplateItem} from "@spt/models/eft/common/tables/ITemplateItem";
import {IProfileTemplates} from "@spt/models/eft/common/tables/IProfileTemplate";
import {IQuest} from "@spt/models/eft/common/tables/IQuest";
import {ILocationServices} from "@spt/models/eft/common/tables/ILocationServices";
import {ItemFilterList} from "../models/mg/items/ItemFilterList";

export class MGTemplates extends CommonlLoad {

    protected databaseService: DatabaseService;
    protected loadList: LoadList;
    protected className = "MGTemplates";

    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
            this.valueHelper = this.loadList.ValueHelper;
        }
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
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

    public getProfiles(): IProfileTemplates {
        return this.databaseService.getProfiles();
    }

    public getQuests(): Record<string, IQuest> {
        return this.databaseService.getQuests();
    }

    public getLocationServices(): ILocationServices {
        return this.databaseService.getLocationServices();
    }

    /**
     * @description Items function
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

    /**
     * @description quests add or change
     */
    public CustomQuest(id:string,quest: IQuest) {
        let Quest:Record<string,IQuest> = this.getQuests();
        if(id !== quest._id){
            this.output._OutputAny(`自定义任务id:${id} 与其 _id:${quest._id} 不一致. 请重新核对！`,"red");
            return;
        }
        if(id in Quest || quest._id in Quest){
            this.output.questAlreadyExist(quest._id);
            return;
        }
        Quest[id] = quest;
        return;
    }

    public CustomQuests(quests: Record<string,IQuest>) {
        return Object.keys(quests).forEach(id => this.CustomQuest(id, quests[id]));
    }
}