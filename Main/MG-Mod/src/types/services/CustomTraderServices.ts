import {LoadList} from "../models/mg/services/ILoadList";
import {CustomService} from "../models/external/CustomService";
import {MGModConfig} from "../models/mg/config/IConfig";
import {IClone} from "../utils/IClone";
import {PathTypes} from "../models/enums/PathTypes";
import {IBundleManifest} from "@spt/loaders/BundleLoader";
import {CustomTraderData, CustomTraderInfo, ICustomTrader} from "../models/mg/traders/ITraderCustom";
import {ITrader} from "@spt/models/eft/common/tables/ITrader";
import {Traders} from "@spt/models/enums/Traders";
import {TraderInfo} from "../models/mg/locales/GlobalInfo";
import {ImageRouter} from "@spt/routers/ImageRouter";
import {Mod} from "../../mod";


export class CustomTraderService extends CustomService {

    protected IClone: IClone;

    constructor(mod: Mod, loadList: LoadList) {
        super(mod, loadList);
        this.IClone = new IClone(this.mod);
    }

    public start(): void {
        const bundlesJson: IBundleManifest = this.initCustomTrader();
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

        }
        return bundlesJson;
    }

    private addCustomTrader(TraderInfo: CustomTraderInfo, traderData: CustomTraderData): boolean {
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
        this.MGList.MGtraders.addCustomTrader(traderId, newTraderDB);
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

    private addQuestImage(TraderName:string,){

    }

}