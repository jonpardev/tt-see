export enum Effect {
    NoService = "NO_SERVICE",
    SignificantDelays = "SIGNIFICANT_DELAYS",
    OtherEffect = "OTHER_EFFECT",
}

export type OfficialAlertRoute = {
    routeType: "Subway" | "Bus";
    route: number;
    title: string;
    effect: Effect | null;
}

export type OfficialAlert = {
    routes: OfficialAlertRoute[];
}