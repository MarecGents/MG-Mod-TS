import {ILogger} from "@spt/models/spt/utils/ILogger";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LogBackgroundColor} from "@spt/models/spt/logging/LogBackgroundColor";

export class FormatOutput {
    private logger: ILogger

    constructor(logger: ILogger) {
        this.logger = logger
    }

    public _OutputAny(text:any,color:LogTextColor,bgColor?:LogBackgroundColor) {
        this.logger.log(text, color,bgColor);
    }

    public _FormatOutput(title: string, content: string, color: LogTextColor,bgColor?:LogBackgroundColor): void {
        this.logger.log(`${title}:${content}`, color,bgColor);
    }

    public classLoaded(className: string): void {
        this.logger.log(`${className}:已加载`, LogTextColor.YELLOW);
    }

    public buffNameRepeat(buffName: string): void {
        this.logger.warning(`针剂Buff名称：${buffName} 重复！请更换其他Buff名称`);
    }

    public questAlreadyExist(questId:string): void {
        this.logger.warning(`自定义任务id: ${questId} 已存在，请更换其他id`);
    }

    public itemNotEquals(itemId:string,_id:string): void {
        this.logger.warning(`物品id：${itemId} 与其 _id:${_id} 不一致，请检查并更改使其保持一致！`);
    }

    public itemReplace(itemId:string){
        this.logger.log(`物品:id为${itemId}，已进行替换。`,LogTextColor.CYAN);
    }
    public itemAdd(itemId:string){
        this.logger.log(`物品：id为${itemId}，已添加。`,LogTextColor.WHITE);
    }

}