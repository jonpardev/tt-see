import { CallbackError, FilterQuery, HydratedDocument } from "mongoose";
import { Alert, IAlert, Status } from "../models/alert.model";

export const saveAlerts = async (alerts: IAlert[]) => (
    new Promise<undefined>((resolve, reject) => {
        const alertsQueue = alerts.map(alert => new Alert(alert));
        Alert.bulkSave(alertsQueue)
            .then(() => resolve(undefined))
            .catch((err: CallbackError) => reject(err));
    }));

export const findAlerts = async () => (
    new Promise<HydratedDocument<IAlert>[]>((resolve, reject) => {
        const filterQuery = {
            status: { $ne: Status.Dismissed }
        } as FilterQuery<IAlert>;
        Alert.find(filterQuery, (err?: Error, alerts?: HydratedDocument<IAlert>[]) => {
            if (err) reject(err);
            if (alerts && alerts.length > 0) resolve(alerts);
            else resolve([] as HydratedDocument<IAlert>[]); // return empty array
        })}));

export const findAlertsByStatus = async (status: string) => (
    new Promise<HydratedDocument<HydratedDocument<IAlert>>[]>((resolve, reject) => {
        const filterQuery = {
            status: status
        } as FilterQuery<IAlert>;
        Alert.find(filterQuery, (err?: Error, alerts?: HydratedDocument<IAlert>[]) => {
            if (err) reject(err);
            if (alerts && alerts.length > 0) resolve(alerts);
            else resolve([] as HydratedDocument<IAlert>[]); // return empty array
        })}));

export const saveOfficialAlerts = async (alerts: HydratedDocument<IAlert>[]) => {
    try {
        await Alert.bulkSave(alerts);
    } catch (error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[ERROR:saveOfficialAlerts] Unexpected`);
    }
}

export const findOfficialAlerts = async (): Promise<HydratedDocument<IAlert>[]> => {
    const filterQuery: FilterQuery<IAlert> = {
        status: {
            $in: [Status.OfficialDelays, Status.OfficialNoService]
        }
    }

    try {
        const alerts = await Alert.find(filterQuery);
        return alerts ?? [ ];
    } catch (error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[ERROR:findOfficialAlerts] Unexpected`);
    }
}