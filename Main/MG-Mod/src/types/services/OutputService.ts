import {ILogger} from "@spt/models/spt/utils/ILogger";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LogBackgroundColor} from "@spt/models/spt/logging/LogBackgroundColor";

export class OutputService {
    private logger: ILogger

    constructor(logger: ILogger) {
        this.logger = logger
    }

    public log(text:any,color:LogTextColor,bgColor?:LogBackgroundColor):void  {
        this.logger.log(text, color,bgColor);
    }

    public warning(text:string):void  {
        this.logger.warning(text);
    }

    public error(text:string):void  {
        this.logger.error(text);
    }

    public _FormatOutput(title: string, content: string, color: LogTextColor,bgColor?:LogBackgroundColor):void {
        this.logger.log(`${title}:${content}`, color,bgColor);
    }

    public classLoaded(className: string):void {
        this.logger.log(`${className}:已加载。`, LogTextColor.YELLOW);
    }

    public debugLog(text:any):void {
        this.logger.log(text,LogTextColor.RED,LogBackgroundColor.GREEN);
    }

    public addItemsSuccess(fileName:string, traderNickName:string):void {
        this.logger.log(`[MG-Mod][独立物品]【${fileName}】已添加到商人【${traderNickName}】中。`, LogTextColor.WHITE);
    }

    public addCustomTraderSuccess(TraderName:string):void {
        this.logger.log(`[MG-Mod][独立商人]【${TraderName}】已加载。`, LogTextColor.MAGENTA);
    }

    public addMGAssortSuccess(fileName:string):void {
        this.logger.log(`[MG-Mod][独立预设]【${fileName}】已加载`, LogTextColor.CYAN);
    }

}