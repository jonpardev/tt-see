export enum Status {
    Dismissed = "DISMISSED",
    Invisible = "INVISIBLE",
    OfficialDelays = "OFFICIAL_DELAYS",
    OfficialNoService = "OFFICIAL_NO_SERVICE",
    PresumedDelays = "PRESUMED_DELAYS",
    PresumedNoService = "PRESUMED_NO_SERVICE",
}

export default interface IAlert {
    map_id: number;
    line_id: number;
    station_id: number;
    status: Status;
}