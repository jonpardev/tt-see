import axios, { AxiosError, AxiosResponse } from 'axios';
import { HydratedDocument } from 'mongoose';
import { OFFICIAL_URI } from '../config/env';
import { Alert, IAlert, Status } from '../models/alert.model';
import { ILine } from '../models/line.models';
import { IStation } from '../models/station.model';
import { Effect, OfficialAlert, OfficialAlertRoute } from '../types/officialAlert.type';
import { findOfficialAlerts, saveOfficialAlerts } from './alert.service';
import { findLatestMap, findLine } from './map.service';

const officialApi = axios.create({
    baseURL: OFFICIAL_URI,
    headers: {
        "Content-type": "application/json"
    }
});

export const updateOfficialAlerts = async () => (
    new Promise<undefined>((resolve, reject) => {
        manageOfficialAlerts()
            .then(alerts => {
                saveOfficialAlerts(alerts)
                    .then(() => {
                        resolve(undefined);
                    })
                    .catch((err: Error) => reject(err));
            })
            .catch((err: Error) => reject(err));
    }));

const manageOfficialAlerts = async () => (
    new Promise<HydratedDocument<IAlert>[]>((resolve, reject) => {
        transformIntoAlerts()
            .then(transformedAlerts => {
                findOfficialAlerts()
                    .then(currentAlerts => {

                        const newAlerts = transformedAlerts.filter(transformedAlert => (
                            currentAlerts.every(currentAlert => (
                                !(transformedAlert.line_id === currentAlert.line_id && transformedAlert.station_id === currentAlert.station_id)
                            ))));
                        const hydratedNewAlerts = newAlerts.map(newAlert => new Alert(newAlert));
                        
                        let alertsWithoutDupes = currentAlerts;
                        if (transformedAlerts && transformedAlerts.length > 0)  {
                            alertsWithoutDupes = currentAlerts.filter(currentAlert => (
                                transformedAlerts.every(transformedAlert => (
                                    !(transformedAlert.line_id === currentAlert.line_id && transformedAlert.station_id === currentAlert.station_id && transformedAlert.status === currentAlert.status)
                                ))));
                        }
                        alertsWithoutDupes.forEach(alertWithoutDupes => {
                            const foundAlert = transformedAlerts.find(alert => (alertWithoutDupes.line_id === alert.line_id && alertWithoutDupes.station_id === alert.station_id));
                            alertWithoutDupes.status = (foundAlert ? foundAlert.status : Status.Dismissed);
                        });

                        const result = hydratedNewAlerts.concat(alertsWithoutDupes);
                        if (result.length > 0) console.log(`[OfficialAlert] Update: ${result.length}`)
                        resolve(result);
                    })
                    .catch((err: Error) => reject(err));
            })
            .catch((err: Error) => reject(err));
    }));

const transformIntoAlerts = async () => {
    try {
        const officialAlertRoutes = await getOfficialAlerts();
        const map = await findLatestMap();
        const alerts: IAlert[] = [ ];
        officialAlertRoutes?.forEach(async (route) => {
            const routeType = route.routeType.toLowerCase();
            const routeNumber = route.route.toString();
            const foundLine = map.lines.find(line => line.type === routeType && line.number === routeNumber);
            if(!foundLine) return; // continue(*skip) for forEach
            // const line = await findLine(routeType, routeNumber);
            const stations = titleToStations(route.title, foundLine.stations);
            stations.forEach(station => {
                const alert: IAlert = {
                    // map_id: map._id,
                    line_id: foundLine._id,
                    station_id: station._id,
                    status: effectToStatus(route.effect),
                }
                alerts.push(alert);
            });
        });
        return alerts;
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[Error] transformIntoAlerts - others`);
    }
}

const getOfficialAlerts = async() => {
    try {
        const response = await officialApi.get<OfficialAlert>("/api/alerts/live-alerts");
        const routes = response.data.routes;
        if (!routes) throw new Error(`[Error] getOfficialAlerts - Cannot find 'routes`);
        const alerts: OfficialAlertRoute[] = [ ];
        routes.forEach(alert => {
            if (alert.routeType !== "Subway") return; // continue(*skip) for forEach
            if (alert.route >= 5 || alert.route < 1) return; // continue(*skip) for forEach
            if ([null, Effect.OtherEffect].includes(alert.effect)) return; // continue(*skip) for forEach
    
            const newAlert: OfficialAlertRoute = {
                routeType: alert.routeType,
                route: alert.route,
                title: alert.title,
                effect: alert.effect,
            }
            alerts.push(newAlert);
        });
        return alerts;
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[Error] getOfficialAlerts - others`);
    }
}

const titleToStations = (title: string, stations: IStation[]) => {
    const foundStations = stations.filter((station) => title.match(station.name)).sort((a, b) => (a.order - b.order));
    const finalStations = stations.filter((station) => (station.order >= foundStations[0].order && station.order <= foundStations[foundStations.length - 1].order));
    return finalStations;
};

const effectToStatus = (effect: string | null) => {
    switch (effect) {
        case Effect.SignificantDelays: {
            return Status.OfficialDelays;
        }
        case Effect.NoService: {
            return Status.OfficialNoService;
        }
        default: {
            throw new Error(`Can't change effect into status: ${effect}`);
        }
    }
}

export const getOfficialRoutes = async() => {
    try {
        const response = await officialApi.get<OfficialAlert>("/api/alerts/live-alerts");
        const routes = response.data.routes;
        if (!routes) throw new Error(`[Error] getOfficialAlerts - Cannot find 'routes`);
        return routes;
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[Error] getOfficialAlerts - others`);
    }
}