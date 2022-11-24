import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { IAlert } from '../models/alert.model';
import * as alertService from '../services/alert.service';

export const updateAlerts = (req: Request, res: Response) => {
    const alerts = req.body as IAlert[];
    alertService.saveAlerts(alerts)
        .then(() => res.sendStatus(200))
        .catch((err: Error) => res.sendStatus(500));
}

export const returnAlerts = (req: Request, res: Response) => {
    const { status } = req.query;
    if (status) {
        alertService.findAlertsByStatus(status.toString())
            .then((alerts: IAlert[]) => res.status(200).json({
                is_o_alive: globalThis.isOfficialServerAlive,
                alerts: alerts,
            }))
            .catch((err: Error) => res.sendStatus(500));
    } else {
        alertService.findAlerts()
            .then((alerts: IAlert[]) => res.status(200).json({
                is_o_alive: globalThis.isOfficialServerAlive,
                alerts: alerts,
            }))
            .catch((err: Error) => res.sendStatus(500));
    }
}