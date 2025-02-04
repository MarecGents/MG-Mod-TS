import {MGTraders} from "../../../servers/MGTraders";
import {MGGlobals} from "../../../servers/MGGlobals";
import {MGTemplates} from "../../../servers/MGTemplates";
import {MGLocales} from "../../../servers/MGLocales";
import {MGHideout} from "../../../servers/MGHideout";
import {MGBots} from "../../../servers/MGBots";
import {MGConfigs} from "../../../servers/MGConfigs";
import {OutputService} from "../../../services/OutputService";
import {MGLocations} from "../../../servers/MGLocations";

export interface LoadList {
    MGList: MGList;
    Output: OutputService;
    [key: string]: any;
}

export interface MGList {
    MGbots: MGBots;
    MGconfigs: MGConfigs
    MGglobals: MGGlobals;
    MGhideout: MGHideout;
    MGlocales: MGLocales;
    MGLocations:MGLocations;
    MGtemplates: MGTemplates;
    MGtraders: MGTraders;
}