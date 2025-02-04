import {AnyInfo, GeneralInfo, ItemsDesc, ItemsInfo, QuestInfo, TraderInfo} from "../models/mg/locales/GlobalInfo";
import {CommonlLoad} from "../models/external/CommonLoad";
import {LoadList} from "../models/mg/services/ILoadList";
import {DatabaseService} from "@spt/services/DatabaseService";
import {Mod} from "../../mod";
import {ILocaleBase} from "@spt/models/spt/server/ILocaleBase";
import {loadMod} from "../loadMod";

export class MGLocales {

    private mod:Mod
    private className:string;
    private MGLoad:loadMod;
    private databaseService: DatabaseService;

    constructor(mod: Mod, MGLoad:loadMod) {
        this.mod = mod;
        this.className = "MGLocales";
        this.MGLoad = MGLoad;
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public getLocales(): ILocaleBase {
        return this.databaseService.getLocales();
    }

    public getGlobal(): Record<string, Record<string, string>> {
        return this.getLocales().global;
    }

    public getServer(): Record<string, Record<string, string>> {
        return this.getLocales().server;
    }

    public getGlobalByLang(id: string): Record<string, string> {
        return this.getGlobal()[id];
    }

    public addInfo(info: GeneralInfo): void {
        let globalLocales: Record<string, Record<string, string>> = this.getGlobal();
        for (let lang in globalLocales) {
            globalLocales[lang][info._id] = info.desc;
        }
    }

    public addItemInfo(info: ItemsInfo): void {
        let globalLocales: Record<string, Record<string, string>> = this.getGlobal();
        const DescList: string[] = ["Name", "ShortName", "Description"]
        for (let lang in globalLocales) {
            DescList.forEach((desc: string): void => {
                if (`${info._id} ${desc}` in globalLocales[lang]) {
                    return;
                }
                globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            })
        }
    }

    public addQuestInfo(info: QuestInfo): void {
        let globalLocales: Record<string, Record<string, string>> = this.getGlobal();
        const DescList: string[] = [
            "name",
            "description",
            "failMessageText",
            "successMessageText",
            "acceptPlayerMessage",
            "declinePlayerMessage",
            "completePlayerMessage"
        ]
        for (let lang in globalLocales) {
            DescList.forEach((desc: string): void => {
                if (`${info._id} ${desc}` in globalLocales[lang]) {
                    return;
                }
                globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            })
            if (Object.keys(info.desc.other ? info.desc.other : {}).length > 0) {
                Object.keys(info.desc.other).forEach((other_id: string):void => {
                    if (other_id in globalLocales[lang]) {
                        return;
                    }
                    globalLocales[lang][other_id] = info.desc.other[other_id];
                })
            }
        }
    }

    public addTraderInfo(info: TraderInfo): void {
        let globalLocales: Record<string, Record<string, string>> = this.getGlobal();
        const DescList: string[] = [
            "FullName",
            "FirstName",
            "Nickname",
            "Location",
            "Description"
        ]
        for (let lang in globalLocales) {
            DescList.forEach((desc: string): void => {
                if (`${info._id} ${desc}` in globalLocales[lang]) {
                    return;
                }
                globalLocales[lang][`${info._id} ${desc}`] = info.desc[desc];
            })
        }
    }

    public addProfileInfo(info: AnyInfo): void {
        const serverLocales: Record<string, Record<string, string>> = this.getServer();
        // const FileControl:
        for (let lang in serverLocales) {
            Object.keys(info).forEach((key: string): void => {
                if (key in serverLocales[lang]) {
                    return;
                }
                serverLocales[lang][key] = info[key];

            });
        }
    }

    public getItemInfoFromSpecificLanguage(Id: string, lang: string): ItemsDesc {
        const globalLocales_lang: Record<string, string> = this.getGlobalByLang(lang);
        const DescList: string[] = ["Name", "ShortName", "Description"]
        const ItemDesc: ItemsDesc = {
            Name: "",
            ShortName: "",
            Description: ""
        }
        Object.keys(DescList).forEach((key: string): void => {
            if (`${Id} ${key}` in globalLocales_lang) {
                return;
            }
            ItemDesc[key] = globalLocales_lang[`${Id} ${key}`];
        })
        return ItemDesc;
    }

    public getTraderNicknameByIdFromSpecificLanguage(Id: string, lang: string): string {
        const globalLocales_lang: Record<string, string> = this.getGlobalByLang(lang);
        if (`${Id} Nickname` in globalLocales_lang) {
            return globalLocales_lang[`${Id} Nickname`];
        }
        return "";
    }

    public getContentByKey(Key: string, lang:string = "ch") {
        const globalLocales_lang: Record<string, string> = this.getGlobalByLang(lang);
        if(Key in globalLocales_lang) {return globalLocales_lang[Key];}
        return "null";
    }


}