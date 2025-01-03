import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LoadList} from "../models/mg/services/ILoadList";
import {IHideout} from "../models/mg/hideout/IHideout";
import {IHideoutArea} from "@sptmodels/eft/hideout/IHideoutArea";
import {IQteData} from "@sptmodels/eft/hideout/IQteData";
import {IHideoutProduction, IScavRecipe} from "@sptmodels/eft/hideout/IHideoutProduction";

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
            this.valueHelper = this.loadList.ValueHelper;
        }

    }

    /**
     * This method is build based on SPT-3.10.X or later
     * @param index
     * @param value
     * @param key
     */
    public c_Production(index: string[], value: any, key?: string): void {
        this.valueHelper._ValueUpdate(this.hideout.production.recipes, index, value, key);
    }

    public c_Scavecase(index: string[], value: any, key?: string): void {
        this.valueHelper._ValueUpdate(this.hideout.production.scavRecipes, index, value, key);
    }

    public c_Area(index: string[], value: any, key?: string): void {
        this.valueHelper._ValueUpdate(this.hideout.areas, index, value, key);
    }
    public c_Qte(index: string[], value: any, key?: string): void {
        this.valueHelper._ValueUpdate(this.hideout.qte, index, value, key);
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

    

}