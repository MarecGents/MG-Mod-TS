import {DependencyContainer} from "tsyringe";
import {VFS} from "@spt/utils/VFS";
import {ILogger} from "@spt/models/spt/utils/ILogger";
import {IPreSptLoadMod} from "@spt/models/external/IPreSptLoadMod";
import {IPostDBLoadMod} from "@spt/models/external/IPostDBLoadMod";
import {IPostSptLoadMod} from "@spt/models/external/IPostSptLoadMod";
import {PreSptModLoader} from "@spt/loaders/PreSptModLoader";
import {loadMod} from "./types/loadMod";
import {LoadList} from "./types/models/mg/services/ILoadList";
import {Main} from "./custom/Main";
import {DatabaseServer} from "../types/servers/DatabaseServer";

export class Mod implements IPreSptLoadMod, IPostDBLoadMod, IPostSptLoadMod {

    public container: DependencyContainer;
    // public container2: DependencyContainer;
    // public container3: DependencyContainer;
    public Logger: ILogger;
    public VFS: VFS;
    public modpath: string;
    private clone: any;
    // private loadList: LoadList;

    preSptLoad(container: DependencyContainer) {
        this.container = container;
        this.Logger = container.resolve<ILogger>("WinstonLogger");
        this.VFS = container.resolve<VFS>("VFS");
        const PreSptModLoader = container.resolve<PreSptModLoader>('PreSptModLoader');
        this.modpath = PreSptModLoader.getModPath("MG-Mod-New");
    }

    postDBLoad(container: DependencyContainer) {
        this.container = container;
        const loadList:LoadList = (new loadMod(this)).load();
        (new Main(this,loadList));
    }

    postSptLoad(container: DependencyContainer) {
        this.container = container;
    }
}

module.exports = {mod: new Mod()};