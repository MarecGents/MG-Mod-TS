import {IProfileSides, IProfileTemplates} from "@spt/models/eft/common/tables/IProfileTemplate";



export interface ICustomProfile extends IProfileTemplates{
    [key:string]:IProfileSides;
}

export interface IMGSingleProfile{
    profileName:string;
    profileSides:IProfileSides;
    description:string;
}

