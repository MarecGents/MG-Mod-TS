import {Mod} from "../../mod";

export class IFileControl {
    private mod:Mod;
    constructor(mod:Mod) {
        this.mod = mod;
    }

    public writeFile(filepath: any, data = "", append = false, atomic = true):void {
        this.mod.VFS.writeFile(filepath, data, append,atomic);
    }

    public removeFile(filepath: string): void{
        this.mod.VFS.removeFile(filepath);
    }

    public readFile(filepath: string):string {
        return this.mod.VFS.readFile(filepath);
    }
}