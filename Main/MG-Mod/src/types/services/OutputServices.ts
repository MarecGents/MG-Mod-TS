import {ILogger} from "@spt/models/spt/utils/ILogger";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LogBackgroundColor} from "@spt/models/spt/logging/LogBackgroundColor";

export class OutputServices {
    private logger: ILogger

    constructor(logger: ILogger) {
        this.logger = logger
    }

    public log(text:any,color:LogTextColor,bgColor?:LogBackgroundColor) {
        this.logger.log(text, color,bgColor);
    }

    public warning(text:string) {
        this.logger.warning(text);
    }

    public error(text:string) {
        this.logger.error(text);
    }

    public _FormatOutput(title: string, content: string, color: LogTextColor,bgColor?:LogBackgroundColor): void {
        this.logger.log(`${title}:${content}`, color,bgColor);
    }

    public classLoaded(className: string): void {
        this.logger.log(`${className}:已加载`, LogTextColor.YELLOW);
    }

    public debugLog(text:string){
        this.logger.log(text,LogTextColor.RED,LogBackgroundColor.GREEN);
    }

    public addItemsSuccess(fileName:string, traderNickName:string){
        this.logger.log(`MG独立物品【${fileName}】已添加到商人【${traderNickName}】中。`, LogTextColor.MAGENTA);
    }

    public addCustomTraderSuccess(TraderName:string){
        this.logger.log(`商人：[${TraderName}] 已加载。`, LogTextColor.CYAN);
    }


}