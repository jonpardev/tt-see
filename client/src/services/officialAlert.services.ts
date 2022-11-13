import axios from "axios";
import backendApi from "../config/api";

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

export const getAllMessagesOnLine = async (lineNumber: string) => {
    const response = await backendApi.get<OfficialAlertRoute[]>("/official");
    const routes = response.data;
    const filteredRoutes = routes.filter(route => route.route.toString() === lineNumber);
    let result: string[] = [ ];
    if (filteredRoutes && filteredRoutes.length > 0) {
        const messages = filteredRoutes.map(route => route.title);
        result = [...messages];
    }
    return result;
}