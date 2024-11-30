import {GeneralInfo, ItemsInfo, QuestInfo, TraderInfo} from "../models/mg/locales/GlobalInfo";
import {CommonlLoad} from "../models/external/CommonLoad";
import {LoadList} from "../models/mg/services/ILoadList";
import {DatabaseService} from "@spt//services/DatabaseService";

export class MGLocales extends CommonlLoad {

    protected globalLocales: object;
    protected loadList: LoadList;
    protected className = "MGLocales";

    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
            this.valueHelper = this.loadList.ValueHelper;
        }
        this.globalLocales = this.mod.container.resolve<DatabaseService>("DatabaseService").getLocales().global;
    }

    public getLocales(){
        return this.globalLocales;
    }

    public addInfo(info: GeneralInfo) {
        for (let lang in this.globalLocales) {
            this.globalLocales[lang][info._id] = info.desc;
        }
    }

    public addItemInfo(info: ItemsInfo) {
        const DescList = ["Name", "ShortName", "Description"]
        for (let lang in this.globalLocales) {
            for (let desc of DescList) {
                this.globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            }
        }
    }

    public addQuestInfo(info: QuestInfo) {
        const DescList = [
            "name",
            "description",
            "failMessageText",
            "successMessageText",
            "acceptPlayerMessage",
            "declinePlayerMessage",
            "completePlayerMessage"
        ]
        for (let lang in this.globalLocales) {
            for (let desc of DescList) {
                this.globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            }
            if (Object.keys(info.other ? info.other : {}).length > 0) {
                for (let other_id in info.other) {
                    this.globalLocales[lang][other_id] = info.other[other_id];
                }
            }
        }
    }

    public addTraderInfo(info: TraderInfo) {
        const DescList = [
            "FullName",
            "FirstName",
            "Nickname",
            "Location",
            "Description"
        ]
        for (let lang in this.globalLocales) {
            for (let desc of DescList) {
                this.globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            }
        }
    }
}