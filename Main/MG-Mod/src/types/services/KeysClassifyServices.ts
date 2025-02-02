import {CustomService} from "../models/external/CustomService";
import {Mod} from "../../mod";
import {LoadList} from "../models/mg/services/ILoadList";
import {MapChName} from "../models/enums/MapChType";
import {IFileControl} from "../utils/IFileControl";
import {PathTypes} from "../models/enums/PathTypes";
import {MGModConfig} from "../models/mg/config/IConfig";
import {HashUtil} from "@spt/utils/HashUtil";
import {IHandbookCategory, IHandbookItem} from "@spt/models/eft/common/tables/IHandbookBase";
import {KeysClassification} from "../models/mg/items/KeysClassification";

export class KeysClassifyServices extends CustomService{

    private FileControl:IFileControl;

    constructor(mod:Mod, loadList:LoadList) {
        super(mod,loadList);
        this.FileControl = new IFileControl(this.mod);
    }

    public start():void {
        const configJson:MGModConfig = JSON.parse(this.FileControl.readFile(PathTypes.ModConfigPath + "config.json"));
        if( typeof configJson.extra.KeyNameExpand == "boolean" && configJson.extra.KeyNameExpand){
            this.keysClassify();
        }
    }

    private keysClassify():void {
        const oriParentID:string[] = ["5c518ec986f7743b68682ce2", "5c518ed586f774119a772aee"];
        const MapNameToHdID:Record<string, string> = {};
        const KeysJson:KeysClassification = JSON.parse(this.FileControl.readFile(PathTypes.KeyPath + "MapKey.json"));
        for(let MapName in MapChName){
            let MapHdID:string = (new HashUtil()).generate();
            MapNameToHdID[MapName] = MapHdID;
            this.Locales.addInfo({
                _id:MapHdID,
                desc:MapChName[MapName],
            });
            let newCategory:IHandbookCategory = {
                Id: MapHdID,
                ParentId: "5b47574386f77428ca22b342",
                Icon: "/files/handbook/icon_keys_mechanic.png",
                Color: "",
                Order: "100"
            };
            this.MGList.MGtemplates.addHandbookCategory(newCategory);

            const HandBookItems:IHandbookItem[] = this.MGList.MGtemplates.getHandbook().Items;
            for(let it in HandBookItems){
                let ParentId:string = HandBookItems[it].ParentId;
                if(!(ParentId in oriParentID)){continue;}
                let id:string = HandBookItems[it].Id;
                for(let Mapname in KeysJson){
                    if(!(id in KeysJson[MapName])){continue;}
                    HandBookItems[MapName].ParentId=MapNameToHdID[Mapname];
                    let Name:string = this.Locales.getContentByKey(`${id} Name`) + " " + MapChName[Mapname];
                    let Desc:string = "<color=#00cccc><b>" + MapChName[Mapname] + "</b></color>\r\n".concat(this.Locales.getContentByKey(`${id} Description`));
                    this.Locales.addInfo({
                        _id:`${id} Name`,
                        desc:Name,
                    });
                    this.Locales.addInfo({
                        _id:`${id} Description`,
                        desc:Desc,
                    });
                }
            }
        }
        this.outPut.classLoaded(`[MG-Mod][钥匙分类功能]`);
    }
}