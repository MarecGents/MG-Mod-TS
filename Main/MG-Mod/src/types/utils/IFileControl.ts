import {Mod} from "../../mod";

export class IFileControl {
    private mod:any;
    constructor(mod:Mod) {
        this.mod = mod;
    }

    public writeFile(filepath: any, data = "", append = false, atomic = true){
        this.mod.VFS.writeFile(filepath, data, append,atomic);
    }

    public removeFile(filepath: string): void{
        this.mod.VFS.removeFile(filepath);
    }
}