import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { ILine } from '../models/line.models';
import { IMap } from '../models/map.model';
import * as mapService from '../services/map.service';

export const updateMap = (req: Request, res: Response) => {
    const map = {
        _id: req.body._id,
        lines: req.body.lines,
    } as IMap;
    mapService.saveMap(map)
        .then(() => res.sendStatus(200))
        .catch((err: Error) => res.sendStatus(500));
}

export const returnLatestMap = (req: Request, res: Response) => {
    const { mapId } = req.query;
    if (!mapId) {
        mapService.findLatestMap()
        .then((map: IMap) => res.status(200).json(map))
        .catch((err: Error) => res.sendStatus(500));
    }
}

export const returnLatestMapId = (req: Request, res: Response) => {
    mapService.findLatestMapId()
        .then((mapId: number) => res.status(200).send(`${mapId}`))
        .catch((err: Error) => res.sendStatus(500));
}

export const returnLine = (req: Request, res: Response) => {
    const {type, number} = req.query;
    if (!type || !number) return res.sendStatus(404);

    mapService.findLine(type.toString(), number.toString())
        .then((line: ILine) => res.status(200).json(line))
        .catch((err: Error) => res.sendStatus(500));
}