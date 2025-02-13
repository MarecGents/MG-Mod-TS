import {ISpawnpoint, ISpawnpointCount, ISpawnpointsForced} from "@spt/models/eft/common/ILooseLoot";

export interface ILooseLoot {
    spawnpointCount?: ISpawnpointCount;
    spawnpointsForced?: ISpawnpointsForced[];
    spawnpoints?: ISpawnpoint[];
}