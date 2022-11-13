import { CallbackError, HydratedDocument, ObjectId, QueryOptions } from 'mongoose';
import { ILine } from '../models/line.models';
import { Map, IMap } from '../models/map.model';

export const saveMap = async (map: IMap) => (
    new Promise<undefined>((resolve, reject) => {
        const newMap = new Map(map);
        newMap.save((err?: CallbackError) => {
            if (err) reject(err);
            else resolve(undefined);
        })
    })
);

export const findMaps = async () => {
    try {
        return await Map.find<IMap>();
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[Error] findMaps - others`);
    }
}

export const findMapIds = async () => {
    const maps = await findMaps();
    const mapIds = maps.map(map => map._id);
    return mapIds;
}

export const findMapById = async (mapId: string) => {
    try {
        const map = await Map.findById<IMap>(mapId);
        if (!map) throw new Error(`[Error] findMapById - Cannot find the map`);
        return map;
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[Error] findMapById - others`);
    }
}

export const findLatestMap = async () => {
    try {
        const queryOptions: QueryOptions = {
            sort: { "_id" : -1}
        }
        const latestMap = await Map.findOne<IMap>({}, {}, queryOptions);
        if (!latestMap) throw new Error(`[Error] findLatestMapId - Cannot find the map`);
        return latestMap;
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[Error] findLatestMapId - others`);
    }
}

export const findLatestMapId = async () => {
    return (await findLatestMap())._id;
}

export const findLine = async (type: string, number: string) => (
    new Promise<ILine>((resolve, reject) => {
        findLatestMap()
            .then((map: IMap) => {
                const foundLine = map.lines.find((line) => (line.type === type && line.number === number));
                if (foundLine) resolve(foundLine);
                else reject(new Error());
            })
            .catch((err: Error) => reject(err));
    }));