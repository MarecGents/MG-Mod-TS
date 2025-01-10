import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LoadList} from "../models/mg/services/ILoadList";
import {IHideout} from "../models/mg/hideout/IHideout";
import {IHideoutArea} from "@spt/models/eft/hideout/IHideoutArea";
import {IQteData} from "@spt/models/eft/hideout/IQteData";
import {IHideoutProduction, IScavRecipe} from "@spt/models/eft/hideout/IHideoutProduction";

export class MGHideout extends CommonlLoad {

    protected hideout: IHideout;
    protected loadList: LoadList;
    protected databaseService: DatabaseService;

    constructor(mod: any) {
        super(mod);
    }

    public init(){
        this.className = "MGHideout";
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
        this.hideout = this.databaseService.getHideout();
    }

    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
        }

    }

    public getProductions():IHideoutProduction[]{
        return this.hideout.production.recipes;
    }

    public getScavecases():IScavRecipe[]{
        return this.hideout.production.scavRecipes;
    }

    public getAreas():IHideoutArea[]{
        return this.hideout.areas;
    }
    public getQte():IQteData[]{
        return this.hideout.qte;
    }

    public c_constructionTime(time:number):void {
        let areas = this.getAreas();
        for(let id1 in areas){
            for(let n in areas[id1].stages){
                let time = areas[id1].stages[n].constructionTime;
                if(time!==0){
                    areas[id1].stages[n].constructionTime = time;
                }
            }
        }
    }

    public c_productionTime(time:number):void {
        let production = this.getProductions();
        for(let it of production){
            if(it.productionTime !== 0){
                it.productionTime = time;
            }
        }
    }

    public c_scavecaseTime(time:number):void {
        let scavecase = this.getScavecases();
        for(let it of scavecase){
            if(it.productionTime !== 0){
                it.productionTime = time;
            }
        }
    }
    

}