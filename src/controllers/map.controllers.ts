import { Request, Response } from 'express';
import { Error, Types } from 'mongoose';
import { IMap } from '../models/map.model';
import * as mapService from '../services/map.service';

export const updateMap = (req: Request, res: Response) => {
    const map = {
        _id: req.body._id ?? new Types.ObjectId(),
        lines: req.body.lines,
    } as IMap;
    mapService.saveMap(map)
        .then(() => res.sendStatus(200))
        .catch((error: Error) => res.sendStatus(500));
}

/**
 * If there is a query, it will return a map has the id, otherwise it returns latest map.
 */
export const returnMap = (req: Request, res: Response) => {
    const { id } = req.query;
    if (id) {
        mapService.findMapById(id.toString())
        .then((map: IMap) => res.status(200).json(map))
        .catch((error: Error) => res.sendStatus(500));
    } else {
        mapService.findLatestMap()
        .then((map: IMap) => res.status(200).json(map))
        .catch((error: Error) => res.sendStatus(500));
    }
}

export const returnLatestMapId = (req: Request, res: Response) => {
    mapService.findLatestMapId()
        .then((mapId: Types.ObjectId) => res.status(200).send(`${mapId.toString()}`))
        .catch((error: Error) => res.sendStatus(500));
}