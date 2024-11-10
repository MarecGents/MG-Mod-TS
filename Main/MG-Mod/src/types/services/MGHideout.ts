import {CommonlLoad} from "../models/external/CommonLoad";
import {DatabaseService} from "@spt/services/DatabaseService";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {LoadList} from "../models/mg/services/ILoadList";
import {IHideout} from "../models/mg/hideout/IHideout";
import {ValueHepler} from "../helpers/ValueHepler";
import {IHideoutArea} from "@sptmodels/eft/hideout/IHideoutArea";
import {IQteData} from "@sptmodels/eft/hideout/IQteData";
import {IHideoutProduction, IScavRecipe} from "@sptmodels/eft/hideout/IHideoutProduction";

export class MGHideout extends CommonlLoad {

    private hideout: IHideout;
    constructor(mod: any) {
        super(mod);
    }

    public onload(loadList?: LoadList) {
        this.loadList = loadList;
        this.valueHelper = this.loadList.ValueHelper;
        this.hideout = this.mod.container.resolve<DatabaseService>("DatabaseService").getHideout();
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