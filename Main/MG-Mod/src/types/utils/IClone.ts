import {DependencyContainer} from "tsyringe";
import {ImporterUtil} from "@spt/utils/ImporterUtil";
import {JsonUtil} from "@spt/utils/JsonUtil";

export class IClone {
    private mod: any;
    constructor(mod) {
        this.mod = mod;
    }

    clone<T>(value:T) {
        const JmporterUtil = this.mod.container.resolve<ImporterUtil>("ImporterUtil");
        const JsonUtil = this.mod.container.resolve<JsonUtil>('JsonUtil');
        if(typeof(value) === "object" && value !== null){
            return JsonUtil.clone(value);
        }
        else if (typeof value === "string"){
            return JsonUtil.clone(JmporterUtil.loadRecursive(value));
        }

    }
}.0