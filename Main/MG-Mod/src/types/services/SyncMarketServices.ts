import {CustomService} from "../models/external/CustomService";
import {Mod} from "../../mod";
import {LoadList} from "../models/mg/services/ILoadList";
import {IFileControl} from "../utils/IFileControl";
import {PathTypes} from "../models/enums/PathTypes";
import {MGPrices} from "../models/mg/price/IPrice";
import {LogTextColor} from "../../../types/models/spt/logging/LogTextColor";
import {ITimeUtils} from "../utils/ITimeUtils";

export class SyncMarketServices extends CustomService{

    private FileControl:IFileControl;

    constructor(mod: Mod, loadList: LoadList) {
        super(mod,loadList);
        this.FileControl = new IFileControl(this.mod);
        this.start()
    }

    public start():void {
        const priceJson:MGPrices = JSON.parse(this.FileControl.readFile(PathTypes.PricePath + "price.json"));
        if((new ITimeUtils().getDateDiffence({
            Year:priceJson.date[0],
            Month:priceJson.date[1],
            Day:priceJson.date[2]
        })) >= 3){
            this.getPriceFromWeb();
        }
        this.MGList.MGtemplates.addPrices(priceJson.prices);
    }

    private getPriceFromWeb():void {
        const tokens:any = JSON.parse(this.FileControl.readFile(PathTypes.PricePath + "tokens.json"));
        // 替换为你的实际信息（仅本地测试使用！）
        const token:string = tokens.token;
        const owner:string = tokens.owner;
        const repo:string = tokens.repo;
        const filePath:string = tokens.filePath; // 文件在仓库中的路径
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
                const pricePath:string = PathTypes.PricePath + "price.json";
                const date:number[] = priceJson.date;
                this.FileControl.removeFile(pricePath);
                this.FileControl.writeFile(pricePath, JSON.stringify(priceJson, null, 4));
                this.outPut.log(`MG实时跳蚤：当前同步数据时间为：${date[0]}年${date[1]}月${date[2]}日`, LogTextColor.BLUE);
            })
            .catch((error:any):void => {
                console.error('实时跳蚤获取错误:', error);
            });
    }
}