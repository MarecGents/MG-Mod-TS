import {LoadList} from "../models/mg/services/ILoadList";
import {CustomService} from "../models/external/CustomService";
import {IClone} from "../utils/IClone";
import {PathTypes} from "../models/enums/PathTypes";
import {IBundleManifest} from "@spt/loaders/BundleLoader";
import {
    CustomTraderData,
    CustomTraderInfo,
    ICustomTrader
} from "../models/mg/traders/ITraderCustom";
import {ITrader} from "@spt/models/eft/common/tables/ITrader";
import {Traders} from "@spt/models/enums/Traders";
import {ItemsDesc, QuestDesc, TraderInfo} from "../models/mg/locales/GlobalInfo";
import {ImageRouter} from "@spt/routers/ImageRouter";
import {Mod} from "../../mod";
import {CustomTraderItems} from "../models/mg/items/EItems";
import {IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {IQuest} from "@spt/models/eft/common/tables/IQuest";


export class CustomTraderService extends CustomService {

    protected IClone: IClone;

    constructor(mod: Mod, loadList: LoadList) {
        super(mod,loadList);
        this.IClone = new IClone(this.mod);
    }

    public start(): void {
        let bundlesJson: IBundleManifest = this.initCustomTrader();
        this.mod.VFS.writeFile(`${this.mod.modpath}bundles.json`,bundlesJson);
    }

    private initCustomTrader(): IBundleManifest {
        const TradersList: Record<string, ICustomTrader> = this.IClone.clone(PathTypes.TraderPath);
        // 第一步先将 bundles.json 删除
        if (this.mod.VFS.exists(`${this.mod.modpath}bundles.json`)) {
            this.mod.VFS.removeFile(`${this.mod.modpath}bundles.json`);
        }
        const bundlesJson: IBundleManifest = {
            manifest: []
        };
        for (let it in TradersList) {

            let TraderData: ICustomTrader = TradersList[it];
            if (!("traderInfo" in TraderData)) {
                this.outPut.warning(`商人${it}不存在配置文件\"traderInfo.json\"，请检查商人文件完整性。`)
                continue;
            }

            let TraderInfo: CustomTraderInfo = TraderData.traderInfo;
            if (TraderInfo.name !== it) {
                this.outPut.warning(`商人[${it}]与\"traderInfo.json\"中的name字段[${TraderInfo.name}]不等，请进行修改。`);
                continue;
            }

            let TraderId: string = TraderInfo._id;
            let TraderName:string = TraderInfo.name;
            if (this.MGList.MGtraders.getTrader(TraderId) || TraderId in Traders) {
                this.outPut.warning(`商人[${it}]的id:[${TraderId}]已存在于游戏中。请修改\"_id\"重新加载。`);
                continue;
            }

            // 添加商人本体信息
            this.addCustomTrader(TraderInfo, TraderData.traderData);
            // 添加商人的任务图片等信息
            this.addQuestImage(TraderInfo, TraderData);
            // 添加商人的独立物品
            this.addItemsToServer(TraderInfo, TraderData);
            //添加商人的物品和任务的文本信息
            this.localesInfoToServer(TraderInfo, TraderData);
            //添加商人的任务和物品跳蚤信息
            this.addTemplatesToServer(TraderInfo, TraderData);

            bundlesJson.manifest.push(...TraderData.bundles.manifest);
        }
        return bundlesJson;
    }

    public addCustomTrader(TraderInfo: CustomTraderInfo, traderData: CustomTraderData): boolean {
        if (TraderInfo.enable === false) {
            return false;
        }
        const traderDB: ITrader = this.IClone.clone(PathTypes.ServicesPath + "TraderDB/");
        const traderId: string = TraderInfo._id;
        let newTraderDB: ITrader = {
            assort: undefined,
            base: undefined,
            dialogue: undefined,
            questassort: undefined,
            services: [],
            suits: []
        };
        // assort
        newTraderDB.assort = traderData.assort ? traderData.assort : traderDB.assort;
        // base
        newTraderDB.base = traderData.base ? traderData.base : traderDB.base;
        newTraderDB.base._id = traderId;
        newTraderDB.base.name = TraderInfo.locales.FullName;
        newTraderDB.base.surname = TraderInfo.locales.FirstName;
        newTraderDB.base.nickname = TraderInfo.locales.Nickname;
        newTraderDB.base.location = TraderInfo.locales.Location;
        newTraderDB.base.insurance.availability = TraderInfo.insurance.enabled;
        newTraderDB.base.insurance.min_payment = TraderInfo.insurance.pay;
        newTraderDB.base.insurance.min_return_hour = TraderInfo.insurance.minreturnTime;
        newTraderDB.base.insurance.max_return_hour = TraderInfo.insurance.maxreturnTime;
        newTraderDB.base.insurance.max_storage_time = TraderInfo.insurance.storageTime;
        newTraderDB.base.repair.availability = TraderInfo.repair.enabled;
        newTraderDB.base.repair.currency_coefficient = TraderInfo.repair.coefficient;
        newTraderDB.base.repair.quality = TraderInfo.repair.quality;
        newTraderDB.base.medic = TraderInfo.medic;
        newTraderDB.base.loyaltyLevels = TraderInfo.loyaltyLevels.range;
        newTraderDB.base.discount = TraderInfo.discount;
        newTraderDB.base.unlockedByDefault = TraderInfo.unlockedDefault;
        // dialogue
        newTraderDB.dialogue = TraderInfo.insurance.Message ? TraderInfo.insurance.Message : traderDB.dialogue;
        // questassort
        newTraderDB.questassort = traderData.questassort ? traderData.questassort : traderData.questassort;
        // services
        newTraderDB.services = traderData.services ? traderData.services : traderData.services;
        // suits
        newTraderDB.questassort = traderData.suits ? traderData.suits : traderData.suits;

        // 商人头像
        const traderImage: string = 'TraderPic.jpg';
        const imagePath: string = `${this.mod.modpath + PathTypes.TraderPath}${TraderInfo.name}/${traderImage}`;
        if (this.mod.VFS.exists(imagePath)){
            newTraderDB.base.avatar = newTraderDB.base.avatar.replace("unKnown.jpg", traderImage);
            const ImageRouter:ImageRouter = this.mod.container.container.resolve<ImageRouter>("ImageRouter");
            ImageRouter.addRoute(newTraderDB.base.avatar.replace(".jpg", ""), imagePath)
        }
        else{
            this.outPut.warning(`${TraderInfo.name}:混蛋！你把我的头像放哪了！快还给我！`)
        }
        // 将商人添加到database/traders中
        this.MGList.MGtraders.addCustomTrader(traderId,newTraderDB);
        Traders[traderId] = traderId;

        // locales/global/xx.json
        const traderInfo: TraderInfo = {
            _id: traderId,
            desc: TraderInfo.locales
        }
        this.Locales.addTraderInfo(traderInfo);

        // 将商人信息添加到config/xxx.json中
        // insurance.json
        if(TraderInfo.insurance.enabled){
            this.MGList.MGconfigs.addTraderReturnChance(traderId, TraderInfo.insurance.chance);
        }
        // quest.json
        this.MGList.MGconfigs.addRepeatableQuestsTraderWhitelist(TraderInfo);
        // ragfair.json
        this.MGList.MGconfigs.addTradersRagfair(traderId);
        // traders.json
        this.MGList.MGconfigs.addNewTraderUpdateTime(traderId, TraderInfo.locales.Nickname, TraderInfo.updateTime);

        // 将商人等级初始化到预设存档中国
        this.MGList.MGtemplates.addTraderInitialLoyaltyLevel(traderId);

        // 添加完毕
        this.outPut.addCustomTraderSuccess(TraderInfo.name);
        return true;
    }

    public addQuestImage(TraderInfo: CustomTraderInfo, traderData: ICustomTrader):void{
        if(!("images" in traderData)){ return;}
        if(!("quests" in traderData.images)){ return;}
        const questImagesPath = `${this.mod.modpath + PathTypes.TraderPath}${TraderInfo.name}/images/quests/`;
        const iconList:any = this.mod.VFS.getFiles(questImagesPath);
        for(let icon in iconList){
            const filename:string = this.mod.VFS.stripExtension(icon);
            const ImageRouter:ImageRouter = this.mod.container.container.resolve<ImageRouter>("ImageRouter");
            ImageRouter.addRoute(`/files/quest/icon/${filename}`, `${questImagesPath}${icon}`);
        }
    }

    public addItemsToServer(TraderInfo: CustomTraderInfo, traderData: ICustomTrader):void{
        // 重写  函数 和 功能重复
        const ItemsList:Record<string, CustomTraderItems> = traderData.items;
        for(let itemName in ItemsList){
            let Item:CustomTraderItems = ItemsList[itemName];
            if(this.MGList.MGtemplates.isInItems(Item.item._id)){
                this.outPut.warning(`警高：自定义商人:${TraderInfo.name}的独立物品:${itemName}已存在，本次添加操作不执行。如果不是重复添加，请修改独立物品的_id,以确保正常使用。`);
                continue;
            }
            this.MGList.MGtemplates.addCustomTraderItem(Item);
        }
    }

    public localesInfoToServer(TraderInfo: CustomTraderInfo, traderData:ICustomTrader):void{
        const itemsDesc:Record<string, ItemsDesc> = traderData.locales.itemsdescription;
        const mail:Record<string, QuestDesc> = traderData.locales.mail;
        for(let id in itemsDesc){
            this.Locales.addItemInfo({
                _id:id,
                desc:itemsDesc[id]
            });
        }
        for(let id in mail){
            this.Locales.addQuestInfo({
                _id:id,
                desc:mail[id],
            });
        }
    }

    public addTemplatesToServer(TraderInfo:CustomTraderInfo, traderData:ICustomTrader):void{
        const quests:Record<string, IQuest> = traderData.templates?.quests;
        const handbook:IHandbookItem[] = traderData.templates?.handbook;

        this.MGList.MGtemplates.addCustomQuests(quests);
        this.MGList.MGtemplates.addHandbookItems(handbook);

    }

}