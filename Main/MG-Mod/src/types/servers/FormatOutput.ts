import {ILogger} from "@spt/models/spt/utils/ILogger";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LogBackgroundColor} from "@spt/models/spt/logging/LogBackgroundColor";

export class FormatOutput {
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

    public _FormatOutput(title: string, content: string, color: LogTextColor,bgColor?:LogBackgroundColor): void {
        this.logger.log(`${title}:${content}`, color,bgColor);
    }

    public classLoaded(className: string): void {
        this.logger.log(`${className}:已加载`, LogTextColor.YELLOW);
    }
}