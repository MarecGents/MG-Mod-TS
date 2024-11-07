import {DatabaseServer} from "@spt/servers/DatabaseServer";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {GeneralInfo, ItemsInfo, TraderInfo, QuestInfo} from "../models/eft/locales/DataInfo";

export class Locales {

    private mod: any;
    private ConfigJson: object;
    private color: any;
    private globalLocales: object;

    constructor(mod: any, configJson: object) {
        this.mod = mod;
        this.ConfigJson = configJson;
        this.color = LogTextColor;
        this.init();
    }

    public init() {
        this.globalLocales = this.mod.container.resolve<DatabaseServer>("DatabaseServer").getTables().locales.global;
        this.mod.Logger.log(Object.keys(this.globalLocales), this.color.RED)
    }

    public addInfo(info: GeneralInfo) {
        for (let lang in this.globalLocales) {
            this.globalLocales[lang][info.id] = info.desc;
        }
    }

    public addItemInfo(info: ItemsInfo) {
        const DescList = ["Name", "ShortName", "Description"]
        for (let lang in this.globalLocales) {
            this.globalLocales[lang][info.id] = info.desc;
        }

    }

    public addQuestInfo(info: QuestInfo) {
        const DescList = ["Name", "ShortName", "Description"]
        for (let lang in this.globalLocales) {
            this.globalLocales[lang][info.id] = info.desc;
        }
    }

    public addTraderInfo(info: TraderInfo) {
        const DescList = ["Name", "ShortName", "Description"]
        for (let lang in this.globalLocales) {
            this.globalLocales[lang][info.id] = info.desc;
        }
    }
}