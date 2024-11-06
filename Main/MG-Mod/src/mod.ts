import { DependencyContainer } from "tsyringe";
import { VFS } from "@spt/utils/VFS";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import {loadMod} from "./types/loadMod";

class Mod implements IPreSptLoadMod , IPostDBLoadMod {
    
    public container: DependencyContainer;
    public Logger: ILogger;
    public VFS: VFS;
    public modpath: string;
    preSptLoad(container:DependencyContainer){
        this.container = container;
        this.Logger = container.resolve<ILogger>("WinstonLogger");
        this.VFS = container.resolve<VFS>("VFS");
        const PreSptModLoader = container.resolve<PreSptModLoader>('PreSptModLoader');
        this.modpath = PreSptModLoader.getModPath("MG-Mod-New");
    }
    postDBLoad(container:DependencyContainer){
        // this.Logger.log((new IClone(this)).clone(a),'red');
        (new loadMod(this)).load();
    }
}

module.exports = {mod: new Mod()};