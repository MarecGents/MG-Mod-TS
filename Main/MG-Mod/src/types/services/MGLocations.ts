import { CommonlLoad } from "../models/external/CommonLoad";
import { ILocations } from "@spt/models/spt/server/ILocations";
import { LoadList } from "../models/mg/services/ILoadList";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ILocation } from "@spt/models/eft/common/ILocation";

export class MGLocations extends CommonlLoad {

    protected databaseService: DatabaseService;
    protected loadList: LoadList;

    constructor(mod: any) {
        super(mod);
    }

    public init(){
        this.className = "MGLocations";
        this.databaseService = this.mod.container.resolve<DatabaseService>("DatabaseService");
    }
    public onload(loadList?: LoadList) {
        if (loadList) {
            this.loadList = loadList;
            this.output = this.loadList.Output;
        }
    }

    public getLocations(): ILocations {
        return this.databaseService.getLocations();
    }

    public getLocation(locationId: string): ILocation {
        return this.databaseService.getLocation(locationId);
    }

}