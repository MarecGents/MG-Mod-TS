import {LoadList} from "../models/mg/services/ILoadList";
import {CustomService} from "../models/external/CustomService";
import {MGModConfig} from "../models/mg/config/IConfig";
import {IClone} from "../utils/IClone";
import {PathTypes} from "../models/enums/PathTypes";
import {IBundleManifest} from "@spt/loaders/BundleLoader";
import {CustomTraderData, CustomTraderInfo, ICustomTrader} from "../models/mg/traders/ITraderCustom";
import {ITrader} from "../../../types/models/eft/common/tables/ITrader";

export class CustomTraderService extends CustomService {

    protected IClone:IClone;
    protected TraderConfig:any;
    constructor(mod:any,loadList:LoadList) {
        super(mod,loadList);
        this.IClone = new IClone(this.mod);
        this.start();
    }
    public start():void{
        const configJson:MGModConfig = this.IClone.clone(PathTypes.ModConfigPath).config;
        this.TraderConfig = configJson.MGTrader;
        if(!this.TraderConfig.enable){ return;}
        const bundlesJson:IBundleManifest = this.initCustomTrader();
    }

    private initCustomTrader():IBundleManifest {
        const TradersList:Record<string, any> = this.IClone.clone(PathTypes.TraderPath);
        // 第一步先将 bundles.json 删除
        if (this.mod.VFS.exists(`${this.mod.modpath}bundles.json`)) {
            this.mod.VFS.removeFile(`${this.mod.modpath}bundles.json`);
        }
        const bundlesJson:IBundleManifest = {
            manifest:[]
        };
        for(let it in TradersList) {
            const TraderData:ICustomTrader = TradersList[it];
            if(!(it in TraderData)){
                this.outPut.warning(`商人${it}不存在配置文件\"${it}.json\"，请检查商人文件完整性。`)
                continue;
            }
            const TraderInfo:CustomTraderInfo = TraderData[it][it];
            this.addCustomTrader(TraderInfo,TraderData.traderData);

        }
        return bundlesJson;
    }

    private addCustomTrader(TraderInfo:CustomTraderInfo,traderData:CustomTraderData):void{
        if(TraderInfo.enable === false){return;}
        const traderDB:ITrader = this.IClone.clone(PathTypes.ServicesPath + "TraderDB/");

    }


}