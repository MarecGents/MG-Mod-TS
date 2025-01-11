import {ImporterUtil} from "@spt/utils/ImporterUtil";
import {JsonUtil} from "@spt/utils/JsonUtil";
import {ICloner} from "@spt/utils/cloners/ICloner";
import {Mod} from "../../mod";

export class IClone implements ICloner {
    private mod: Mod;

    constructor(mod:Mod) {
        this.mod = mod;
    }

    clone<T>(value: T) {
        const ImporterUtil:ImporterUtil = this.mod.container.resolve<ImporterUtil>("ImporterUtil");
        const JsonUtil:JsonUtil = this.mod.container.resolve<JsonUtil>('JsonUtil');
        if (typeof (value) === "object" && value !== null) {
            return JsonUtil.clone(value);
        } else if (typeof value === "string") {
            // on this condition, value is the relative path
            return JsonUtil.clone(ImporterUtil.loadRecursive(this.mod.modpath+value));
        }
    }
}