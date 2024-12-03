import {LoadList, MGList} from "../types/models/mg/services/ILoadList";
import {ValueHepler} from "../types/helpers/ValueHepler";
import {FormatOutput} from "../types/servers/FormatOutput";
import {IItem} from "@spt/models/eft/common/tables/IItem";
import {IFormatUtils} from "../types/utils/IFormatUtils";

export class Main{
    private loadList:LoadList;
    private mod: any;
    private MGList: MGList;
    private updateValue: ValueHepler;
    private outPut: FormatOutput;
    constructor(mod,loadList:LoadList){
        this.loadList = loadList;
        this.MGList = this.loadList.MGList;
        this.updateValue = this.loadList.ValueHelper;
        this.outPut = this.loadList.Output;
        this.mod = mod;
        this.start();
    }

    public start(){
        const assort:IItem[] = [
            {
            "_id": "mgtrader_default_assort_bullet01",
            "_tpl": "5d6e6911a4b9361bd5780d52",
            "parentId": "hideout",
            "slotId": "hideout",
            "upd": {
                "UnlimitedCount": true,
                "StackObjectsCount": 9999999
            }
        },
            {
                "_id": "mgtrader_default_assort_bullet02",
                "_tpl": "5d6e68a8a4b9360b6c0d54e2",
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "UnlimitedCount": true,
                    "StackObjectsCount": 9999999
                }
            },
            {
                "_id": "mgtrader_default_assort_bullet03",
                "_tpl": "5e85a9f4add9fe03027d9bf1",
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "UnlimitedCount": true,
                    "StackObjectsCount": 9999999
                }
            },
            {
                "_id": "mgtrader_default_assort_bullet04",
                "_tpl": "5e85aa1a988a8701445df1f5",
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "UnlimitedCount": true,
                    "StackObjectsCount": 9999999
                }
            },
            {
                "_id": "mgtrader_default_assort_bullet05",
                "_tpl": "5c925fa22e221601da359b7b",
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "UnlimitedCount": true,
                    "StackObjectsCount": 9999999
                }
            },
            {
                "_id": "mgtrader_default_assort_bullet06",
                "_tpl": "5efb0da7a29a85116f6ea05f",
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "UnlimitedCount": true,
                    "StackObjectsCount": 9999999
                }
            }
            ];
        (new IFormatUtils()).assortIdIssue(assort,this.mod);
    }
}