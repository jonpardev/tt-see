export enum Status {
    Dismissed = "DISMISSED",
    Invisible = "INVISIBLE",
    OfficialDelays = "OFFICIAL_DELAYS",
    OfficialNoService = "OFFICIAL_NO_SERVICE",
    NeedToCheck = "NEED_TO_CHECK",
}

export default interface IAlert {
    line_id: string;
    status: Status;
    station_ids: string[];
    messages:string[];
}

export type AlertsResponse = {
    is_o_alive: boolean,
    alerts: IAlert[],
}