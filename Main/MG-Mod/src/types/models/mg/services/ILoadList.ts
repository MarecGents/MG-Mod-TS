import {MGTraders} from "../../../services/MGTraders";
import {MGGlobals} from "../../../services/MGGlobals";
import {MGTemplates} from "../../../services/MGTemplates";
import {MGLocales} from "../../../services/MGLocales";
import {MGHideout} from "../../../services/MGHideout";
import {MGBots} from "../../../services/MGBots";
import {MGConfigs} from "../../../services/MGConfigs";
import {FormatOutput} from "../../../servers/FormatOutput";
import {ValueUpdate} from "../../../servers/ValueUpdate";

export interface LoadList {
    MGList: MGList;
    Output: FormatOutput;
    ValueUpdate:ValueUpdate;
    [key: string]: any;
}

export interface MGList {
    MGtraders: MGTraders;
    MGglobals: MGGlobals;
    MGtemplates: MGTemplates;
    MGlocales: MGLocales;
    MGhideout: MGHideout;
    MGbots: MGBots;
    MGconfigs: MGConfigs
}