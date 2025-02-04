import {Mod} from "../../mod";
import {IFileControl} from "../utils/IFileControl";
import {PathTypes} from "../models/enums/PathTypes";
import {MGPrices} from "../models/mg/price/IPrice";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {ITimeUtils} from "../utils/ITimeUtils";
import {loadMod} from "../loadMod";
import {OutputService} from "./OutputService";
// import {MGLocales} from "../servers/MGLocales";

export class SyncMarketService {

    private mod:Mod
    private MGLoad:loadMod;
    private outPut:OutputService;
    // private Locales:MGLocales;
    private FileControl:IFileControl;

    constructor(mod: Mod, MGLoad: loadMod) {
        this.mod = mod;
        this.MGLoad = MGLoad;
        this.outPut = this.MGLoad.Output;
        // this.Locales = this.MGLoad.MGLocales;
        this.FileControl = new IFileControl(this.mod);
    }

    public start(): void {
        let priceJson: MGPrices = JSON.parse(this.FileControl.readFile(this.mod.modpath + PathTypes.PricePath + "price.json"));
        if ((new ITimeUtils().getDateDiffence({
            Year: priceJson.date[0],
            Month: priceJson.date[1],
            Day: priceJson.date[2]
        })) >= 3) {
            priceJson = this.getPriceFromWeb();
        }
        this.MGLoad.MGTemplates.addPrices(priceJson.prices);
        this.outPut.classLoaded(`[MG-Mod][实时跳蚤]`);
        this.outPut.log(`MG实时跳蚤：当前同步数据时间为：${priceJson.date[0]}年${priceJson.date[1]}月${priceJson.date[2]}日`, LogTextColor.BLUE);
    }

    private getPriceFromWeb():MGPrices {
        const tokens:any = JSON.parse(this.FileControl.readFile(this.mod.modpath + PathTypes.PricePath + "tokens.json"));
        const token:string = tokens.token;
        const owner:string = tokens.owner;
        const repo:string = tokens.repo;
        const filePath:string = tokens.filePath; // 文件在仓库中的路径
        let priceJson_:MGPrices = {} as MGPrices;
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3.raw' // 直接获取文件内容（非Base64）
            }
        })
            .then((response:Response):Promise<any> => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((priceJson:MGPrices):void => {
                const pricePath:string = this.mod.modpath + PathTypes.PricePath + "price.json";
                this.FileControl.removeFile(pricePath);
                this.FileControl.writeFile(pricePath, JSON.stringify(priceJson, null, 4));
                priceJson_ = priceJson;
            })
            .catch((error:any):void => {
                console.error('实时跳蚤获取错误:', error);
            });
        return priceJson_;
    }
}