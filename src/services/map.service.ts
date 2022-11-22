import { QueryOptions } from 'mongoose';
import { Map, IMap } from '../models/map.model';

export const saveMap = async (map: IMap) => {
    const mapModel = new Map(map);
    mapModel.save()
        .then()
        .catch(error => {
            if (error instanceof Error) throw error;
            else throw new Error(`[ERROR:saveMap] Unexpected`);
        });
}

export const findMaps = async () => {
    try {
        return await Map.find<IMap>();
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[ERROR:findMaps] Unexpected`);
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
        if (!map) throw new Error(`[ERROR:findMapById] Cannot find a map has the id`);
        return map;
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[ERROR:findMapById] Unexpected`);
    }
}

export const findLatestMap = async () => {
    try {
        const queryOptions: QueryOptions = {
            sort: { "createdAt" : -1}
        }
        const latestMap = await Map.findOne<IMap>({}, {}, queryOptions);
        if (!latestMap) throw new Error(`[ERROR:findLatestMapId] Cannot find a map has the condition`);
        return latestMap;
    } catch(error: unknown) {
        if (error instanceof Error) throw error;
        else throw new Error(`[ERROR:findLatestMapId] Unexpected`);
    }
}

export const findLatestMapId = async () => {
    return (await findLatestMap())._id;
}