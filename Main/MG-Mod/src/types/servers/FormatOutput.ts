import {ILogger} from "@spt/models/spt/utils/ILogger";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";

export class FormatOutput {
    private logger:ILogger
    constructor(logger:ILogger) {
        this.logger = logger
    }
    public classLoaded(className: string): void {
        this.logger.log(`${className}:已加载`,LogTextColor.YELLOW)
    }
}