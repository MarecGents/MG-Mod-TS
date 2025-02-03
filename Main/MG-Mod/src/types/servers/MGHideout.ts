import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LoadList} from "../models/mg/services/ILoadList";
import {IHideout} from "../models/mg/hideout/IHideout";
import {IHideoutArea} from "@spt/models/eft/hideout/IHideoutArea";
import {IQteData} from "@spt/models/eft/hideout/IQteData";
import {IHideoutProduction, IScavRecipe} from "@spt/models/eft/hideout/IHideoutProduction";
import {Mod} from "../../mod";
import {loadMod} from "../loadMod";

export class MGHideout{

    private mod:Mod;
    private className:string;
    private MGLoad:loadMod;
    private databaseService: DatabaseService;

    constructor(mod: Mod, MGLoad:loadMod) {
        this.mod = mod;
        this.className = "MGHideout";
        this.MGLoad = MGLoad;
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public getHideout():IHideout{
        return this.databaseService.getHideout();
    }

    public getProductions():IHideoutProduction[]{
        return this.getHideout().production.recipes;
    }

    public getScavecases():IScavRecipe[]{
        return this.getHideout().production.scavRecipes;
    }

    public getAreas():IHideoutArea[]{
        return this.getHideout().areas;
    }
    public getQte():IQteData[]{
        return this.getHideout().qte;
    }

    public c_constructionTime(time:number):void {
        let areas:IHideoutArea[] = this.getAreas();
        for(let id1 in areas){
            for(let n in areas[id1].stages){
                let time:number = areas[id1].stages[n].constructionTime;
                if(time!==0){
                    areas[id1].stages[n].constructionTime = time;
                }
            }
        }
    }

    public c_productionTime(time:number):void {
        let production:IHideoutProduction[] = this.getProductions();
        for(let it of production){
            if(it.productionTime !== 0){
                it.productionTime = time;
            }
        }
    }

    public c_scavecaseTime(time:number):void {
        let scavecase:IScavRecipe[] = this.getScavecases();
        for(let it of scavecase){
            if(it.productionTime !== 0){
                it.productionTime = time;
            }
        }
    }
    

}