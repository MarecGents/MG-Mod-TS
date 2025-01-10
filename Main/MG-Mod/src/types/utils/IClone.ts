import {DependencyContainer} from "tsyringe";
import {ImporterUtil} from "@spt/utils/ImporterUtil";
import {JsonUtil} from "@spt/utils/JsonUtil";
import {ICloner} from "@spt/utils/cloners/ICloner";

export class IClone implements ICloner {
    private mod: any;

    constructor(mod) {
        this.mod = mod;
    }

    clone<T>(value: T) {
        const JmporterUtil = this.mod.container.resolve<ImporterUtil>("ImporterUtil");
        const JsonUtil = this.mod.container.resolve<JsonUtil>('JsonUtil');
        if (typeof (value) === "object" && value !== null) {
            return JsonUtil.clone(value);
        } else if (typeof value === "string") {
            // on this condition, value is the relative path
            return JsonUtil.clone(JmporterUtil.loadRecursive(this.mod.modpath+value));
        }
    }
}