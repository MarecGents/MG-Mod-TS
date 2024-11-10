import {CommonlLoad} from "../models/external/CommonLoad";
import {ILocations} from "@spt/models/spt/server/ILocations";
import {LoadList} from "../models/mg/services/ILoadList";
import {DatabaseService} from "@spt/services/DatabaseService";
import {ILocation} from "@spt/models/eft/common/ILocation";

export class MGLocations extends CommonlLoad{
    private databaseService: DatabaseService;

    constructor(mod:any) {
        super(mod);
    }

    public onload(loadList?: LoadList) {
        this.loadList = loadList;
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }

    public getLocations(): ILocations{
        return this.databaseService.getLocations();
    }

    public getLocation(locationId:string):ILocation{
        return this.databaseService.getLocation(locationId);
    }

}