import {Mod} from "../../mod";
import {loadMod} from "../loadMod";
import {IFileControl} from "../utils/IFileControl";
import {IMGSingleProfile} from "../models/mg/profiles/ICustomProfile";
import {PathTypes} from "../models/enums/PathTypes";

export class CustomProfileService {

    private mod:Mod;
    private MGLoad:loadMod;

    constructor(mod:Mod, MGLoad:loadMod) {
        this.mod = mod;
        this.MGLoad = MGLoad;
        this.start();
    }

    private start():void {
        const FileControl:IFileControl = new IFileControl(this.mod);
        const Profiles:IMGSingleProfile[] = JSON.parse(FileControl.readFile(this.mod.modpath + PathTypes.ProfilePath + "profile.json")) as IMGSingleProfile[];
        this.MGLoad.MGTemplates.addProfiles(Profiles);
        this.MGLoad.Output.classLoaded("[MG-Mod][独立存档]");
    }

}