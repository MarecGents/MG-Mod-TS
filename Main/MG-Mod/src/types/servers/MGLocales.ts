import {AnyInfo, GeneralInfo, ItemsInfo, QuestInfo, TraderInfo} from "../models/mg/locales/GlobalInfo";
import {CommonlLoad} from "../models/external/CommonLoad";
import {LoadList} from "../models/mg/services/ILoadList";
import {DatabaseService} from "@spt/services/DatabaseService";
import {IGlobals} from "@spt/models/eft/common/IGlobals";
import {Mod} from "../../mod";

export class MGLocales extends CommonlLoad {

    protected loadList: LoadList;
    protected databaseService: DatabaseService;

    constructor(mod: Mod) {
        super(mod);
    }

    public init() {
        this.className = "MGLocales";
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
        }
    }

    public getLocales():IGlobals{
        return this.databaseService.getGlobals();
    }

    public getServer(){
        return this.databaseService.getServer();
    }

    public getInfoByWholeId(id:string){
        return this.getLocales()[id];
    }

    public addInfo(info: GeneralInfo) {
        let globalLocales = this.getLocales();
        for (let lang in globalLocales) {
            globalLocales[lang][info._id] = info.desc;
        }
    }

    public addItemInfo(info: ItemsInfo) {
        let globalLocales = this.getLocales();
        const DescList = ["Name", "ShortName", "Description"]
        for (let lang in globalLocales) {
            DescList.forEach((desc:string) =>{
                globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            })
        }
    }

    public addQuestInfo(info: QuestInfo) {
        let globalLocales = this.getLocales();
        const DescList = [
            "name",
            "description",
            "failMessageText",
            "successMessageText",
            "acceptPlayerMessage",
            "declinePlayerMessage",
            "completePlayerMessage"
        ]
        for (let lang in globalLocales) {
            DescList.forEach((desc:string) =>{
                globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            })
            if (Object.keys(info.other ? info.other : {}).length > 0) {
                Object.keys(info.other).forEach((other_id:string) => {
                    globalLocales[lang][other_id] = info.other[other_id];
                })
            }
        }
    }

    public addTraderInfo(info: TraderInfo) {
        let globalLocales = this.getLocales();
        const DescList = [
            "FullName",
            "FirstName",
            "Nickname",
            "Location",
            "Description"
        ]
        for (let lang in globalLocales) {
            DescList.forEach((desc:string) =>{
                globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            })
        }
    }

    public addProfileInfo(info:AnyInfo){
        let serverLocales = this.getServer();
        Object.keys(info).forEach(key => {serverLocales[key] = info[key]});
    }
}