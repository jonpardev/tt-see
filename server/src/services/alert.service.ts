import { CallbackError, FilterQuery, HydratedDocument, ProjectionType } from "mongoose";
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

export const saveOfficialAlerts = async (alerts: HydratedDocument<IAlert>[]) => (
    new Promise<undefined>((resolve, reject) => {
        Alert.bulkSave(alerts)
            .then(() => resolve(undefined))
            .catch((err: CallbackError) => reject(err));
    }));

export const findOfficialAlerts = async () => (
    new Promise<HydratedDocument<IAlert>[]>((resolve, reject) => {
        const filterQuery = {
            status: {
                $in: [Status.OfficialDelays, Status.OfficialNoService]
            }
        } as FilterQuery<IAlert>;
        Alert.find(filterQuery, (err?: Error, alerts?: HydratedDocument<IAlert>[]) => {
            if (err) reject(err);
            if (alerts && alerts.length > 0) resolve(alerts);
            else resolve([] as HydratedDocument<IAlert>[]); // return empty array
        })}));

export const findPresumedAlerts = async () => (
    new Promise<IAlert[]>((resolve, reject) => {
        const filterQuery = {
            status: {
                $in: [Status.PresumedDelays, Status.PresumedNoService]
            }
        } as FilterQuery<IAlert>;
        Alert.find(filterQuery, (err?: Error, alerts?: HydratedDocument<IAlert>[]) => {
            if (err) reject(err);
            if (alerts && alerts.length > 0) resolve(alerts.map(alert => alert.toObject()));
            else resolve([] as IAlert[]); // return empty array
        })}));