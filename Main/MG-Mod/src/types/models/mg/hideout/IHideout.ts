import {IHideoutArea} from "@spt/models/eft/hideout/IHideoutArea";
import {IHideoutProductionData, IScavRecipe} from "@spt/models/eft/hideout/IHideoutProduction";
import {IQteData} from "@spt/models/eft/hideout/IQteData";
// import {IHideoutScavCase} from "@spt/models/eft/hideout/IHideoutScavCase";
import {IHideoutSettingsBase} from "@spt/models/eft/hideout/IHideoutSettingsBase";

export interface IHideout {
    areas:IHideoutArea[];
    production:IHideoutProductionData;
    qte:IQteData[];
    scavcase:IScavRecipe[];
    settings:IHideoutSettingsBase;
}