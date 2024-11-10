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

    public _FormatOutput(title: string, content: string, color: LogTextColor): void {
        this.logger.log(`${title}:${content}`, color)
    }

    public classLoaded(className: string): void {
        this.logger.log(`${className}:已加载`, LogTextColor.YELLOW)
    }

    public buffNameRepeat(buffName: string): void {
        this.logger.log(`针剂Buff名称：${buffName} 重复！请更换其他Buff名称`)
    }
}