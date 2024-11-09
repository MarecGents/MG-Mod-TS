import {DatabaseServer} from "@spt/servers/DatabaseServer";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {GeneralInfo, ItemsInfo, TraderInfo, QuestInfo} from "../models/mg/locales/GlobalInfo";
import {ModConfig} from "../models/mg/config/IConfig";
import {CommonlLoad} from "../models/external/CommonLoad";

export class MGLocales extends CommonlLoad{

    private globalLocales: object;


    constructor(mod: any, data: ModConfig) {
        super(mod,data)
    }

    public onload<T>():T {
        this.globalLocales = this.mod.container.resolve<DatabaseServer>("DatabaseServer").getTables().locales.global;
        this.init();
        return;
    }

    public init<T>():T{
        if(this.globalLocales){
            this.mod.Logger.log("MGLocales loaded",LogTextColor.YELLOW);
        }
        return;
    }

    public addInfo(info: GeneralInfo) {
        for (let lang in this.globalLocales) {
            this.globalLocales[lang][info._id] = info.desc;
        }
    }

    public addItemInfo(info: ItemsInfo) {
        const DescList = ["Name", "ShortName", "Description"]
        for (let lang in this.globalLocales) {
            for(let desc of DescList){
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
            for(let desc of DescList){
                this.globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            }
            if(Object.keys(info.other?info.other:{}).length > 0){
                for(let other_id in info.other){
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
            for(let desc of DescList){
                this.globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            }
        }
    }
}