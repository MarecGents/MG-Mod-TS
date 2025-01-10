import {MGTraders} from "../../../services/MGTraders";
import {MGGlobals} from "../../../services/MGGlobals";
import {MGTemplates} from "../../../services/MGTemplates";
import {MGLocales} from "../../../services/MGLocales";
import {MGHideout} from "../../../services/MGHideout";
import {MGBots} from "../../../services/MGBots";
import {MGConfigs} from "../../../services/MGConfigs";
import {FormatOutput} from "../../../servers/FormatOutput";
import {MGLocations} from "../../../services/MGLocations";

export interface LoadList {
    MGList: MGList;
    Output: FormatOutput;
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