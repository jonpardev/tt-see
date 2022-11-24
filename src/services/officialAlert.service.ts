import { HydratedDocument, Types } from 'mongoose';
import { OFFICIAL_URI } from '../config/env';
import { Alert, IAlert, IAlertDto, Status } from '../models/alert.model';
import { IStation } from '../models/station.model';
import { Effect, OfficialAlert as OfficialRaw, OfficialAlertRoute as OfficialRawRoute } from '../types/officialAlert.type';
import { findOfficialAlerts, saveOfficialAlerts } from './alert.service';
import { findLatestMap } from './map.service';
import crossFetch from 'cross-fetch';

export const updateOfficialAlerts = async () => {
    try {
        const alerts = await manageOfficialAlerts();
        await saveOfficialAlerts(alerts);
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[ERROR:updateOfficialAlerts] Unexpected`);
    }
    
}

/**
 * Compare newly retrieved alerts with stored alerts, and update them.
 */
const manageOfficialAlerts = async (): Promise<HydratedDocument<IAlert>[]> => {
    try {
        const updateTargetAlerts: HydratedDocument<IAlert>[] = [ ];

        const newAlertDtos = await transformToAlerts();
        const currentAlerts = await findOfficialAlerts();

        // Take one by one from newAlertDtos and if currentAlerts had already had it, just change the stations of it or make new alert from it.
        newAlertDtos.forEach(newAlertDto => {
            const dateNow = new Date(Date.now());
            const foundAlertIndex = currentAlerts.findIndex(currentAlert => newAlertDto.line_id.equals(currentAlert.line_id) && newAlertDto.status === currentAlert.status);

            if (foundAlertIndex >= 0) {
                const foundAlert: HydratedDocument<IAlert> = currentAlerts[foundAlertIndex];
                // And remove the alert so that later, the remaining alerts can be flagged as dismissed.
                currentAlerts.splice(foundAlertIndex, 1);
                // compare the station array
                if (foundAlert.station_ids.sort().toString() !== newAlertDto.station_ids.sort().toString()) {
                    foundAlert.station_ids = newAlertDto.station_ids;
                    foundAlert.messages = newAlertDto.messages;
                    foundAlert.updatedAt = new Date(Date.now());
                    updateTargetAlerts.push(foundAlert);
                }
            } else {
                updateTargetAlerts.push(new Alert({
                    ...newAlertDto,
                    _id: new Types.ObjectId(),
                    createdAt: dateNow,
                    updatedAt: dateNow,
                } as IAlert));
            }
        });

        // Flag the remaining alerts.
        currentAlerts.forEach(remainingAlert => {
            const dismissedAlert: HydratedDocument<IAlert> = remainingAlert;
            dismissedAlert.status = Status.Dismissed;
            updateTargetAlerts.push(dismissedAlert);
        });

        if (updateTargetAlerts.length > 0) console.log(`[LOG:manageOfficialAlerts] Updated: ${updateTargetAlerts.length}`);

        return updateTargetAlerts;
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[ERROR:manageOfficialAlerts] Unexpected`);
    }
}

/**
 * Transform alerts from `getOfficialAlerts` into `IAlert` model
 */
const transformToAlerts = async () => {
    try {
        const officialRawRoutes = await getOfficialRawRoutes();
        const map = await findLatestMap();
        const alerts: IAlertDto[] = [ ];
        officialRawRoutes?.forEach(route => {
            const rawType = route.routeType.toLowerCase();
            const rawNumber = route.route.toString();
            const foundLine = map.lines.find(line => line.type === rawType && line.number === rawNumber);
            if(!foundLine) return; // continue(*skip) for forEach
            const processedStatus = effectToStatus(route.effect);
            const processedStation_ids = titleToStations(route.title, foundLine.stations).map(station => station._id);
            
            const foundIndex = alerts.findIndex(alert => foundLine._id.equals(alert.line_id) && processedStatus === alert.status);
            if(foundIndex >= 0) {
                alerts[foundIndex].station_ids = alerts[foundIndex].station_ids.concat(processedStation_ids);
                alerts[foundIndex].messages.push(route.title);
            } else {
                const alert: IAlertDto = {
                    line_id: foundLine._id,
                    status: processedStatus,
                    station_ids: processedStation_ids,
                    messages: [route.title],
                }
                alerts.push(alert);
            }
        });
        return alerts;
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[ERROR:transformToAlerts] Unexpected`);
    }
}

/**
 * Retrieve raw data from the official server and purify them.
 */
const getOfficialRawRoutes = async() => {
    try {
        const response = await crossFetch(OFFICIAL_URI);
        const data = (await response.json()) as OfficialRaw;
        const routes = data.routes;
        if (!routes) throw new Error(`[ERROR:getOfficialAlerts] Cannot find 'routes`);
        const rawRoutes: OfficialRawRoute[] = [ ];
        routes.forEach(alert => {
            if (alert.routeType !== "Subway") return; // continue(*skip) for forEach
            if (alert.route >= 5 || alert.route < 1) return; // continue(*skip) for forEach
            if ([null, Effect.OtherEffect].includes(alert.effect)) return; // continue(*skip) for forEach
    
            const newAlert: OfficialRawRoute = {
                routeType: alert.routeType,
                route: alert.route,
                title: alert.title,
                effect: alert.effect,
            }
            rawRoutes.push(newAlert);
        });
        globalThis.isOfficialServerAlive = true;
        return rawRoutes;
    } catch(error: unknown) {
        globalThis.isOfficialServerAlive = false;
        if (error instanceof Error) throw error;
        else throw new Error(`[ERROR:getOfficialAlerts] Unexpected`);
    }
}

/**
 * Extract station names from `title` and find matched stations.
 * @param title A string that station names will be extracted from.
 * @param stations An array of `IStation` that find matches from.
 * @returns An array of `IStation`.
 */
const titleToStations = (title: string, stations: IStation[]) => {
    const foundStations = stations.filter((station) => title.match(station.name)).sort((a, b) => (a.order - b.order));
    const finalStations = stations.filter((station) => (station.order >= foundStations[0].order && station.order <= foundStations[foundStations.length - 1].order));
    return finalStations;
};

/**
 * Convert `effect` to `Status`
 * @param effect 
 * @returns `Status`
 */
const effectToStatus = (effect: string | null) => {
    switch (effect) {
        case Effect.SignificantDelays: {
            return Status.OfficialDelays;
        }
        case Effect.NoService: {
            return Status.OfficialNoService;
        }
        default: {
            throw new Error(`[ERROR:effectToStatus] Cannot recognise effect: ${effect}`);
        }
    }
}