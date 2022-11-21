import IRoute from '../models/route.model';
import { ILine, ILineDto, IStation } from '../models/map.model';
import * as localStorageService from '../services/localStorage.services';
import * as mapService from '../services/map.services';
import { SetStateAction, useCallback } from 'react';

type FinalFunc = () => Promise<void>

export const localStorageInitializer = async (finalFunc: FinalFunc) => {
    localStorageMapUpdater()
        // originally, map/routes updater are designed working separately
        // but because the temporary function, allSubwayLinesProvider() uses getLines(),
        // they are working asynchronously
        .then(() => localStorageRoutesUpdater())
        .then(() => finalFunc());
}

const localStorageMapUpdater = async () => {
    try {
        const map = await localStorageService.getMap();
        if (!map) {
            const mapDto = await mapService.getMapDto();
            localStorageService.setMapLines(mapDto);
        } else {
            const latestId = await mapService.getLatestId();
            if (latestId !== map._id) {
            const mapDto = await mapService.getMapDto();
            localStorageService.setMapLines(mapDto);
            }
        }
    }
    catch(error) {
      // console.error(error);
    }
}

const localStorageRoutesUpdater = async () => {
    try {
        const localStorageRoutes = await localStorageService.getRoutes();
        // <!-- temporary function until the route selection is implemented
        if (!localStorageRoutes || localStorageRoutes.length === 0) {
            const allSubwayLines = await allSubwayLinesProvider();
            localStorageService.setRoutes(allSubwayLines);
        }
        // -->
    } catch(error) {
        // console.error(error);
    }
}

// <!-- temporary function until the route selection is implemented
const allSubwayLinesProvider = async () => {
    const allSubwayLines = await localStorageService.getLines();
    let newRoutes: IRoute[] = [ ];
    if (allSubwayLines) {
        allSubwayLines.sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number));
        allSubwayLines.forEach((line: ILineDto, index: number) => {
        const stations = line.stations.sort((a, b) => a.order - b.order);
        newRoutes.push(lineToRoute(index, line, stations[0], stations[stations.length - 1]));
        });
    }
    return newRoutes;
}
// -->

export const lineToRoute = (order:number, line: ILineDto, start: IStation, end: IStation) => {
    const newLine: ILine = {
        _id: line._id,
        type: line.type,
        number: line.number,
        name: line.name,
        bgColor: line.bgColor,
        textColor: line.textColor,
    }
    let stationIds: number[] = [];
    const stations = line.stations.sort((a, b) => a.order - b.order);
    if (start.order < end.order) stationIds = stations.slice(start.order - 1, end.order).map(station => station._id);
    else if (start.order > end.order) stationIds = stations.slice(end.order - 1, start.order).sort((a, b) => b.order - a.order).map(station => station._id);
    else stationIds = [start._id];
    return {
        order: order,
        line: newLine,
        stations: stationIds,
        presumedDelays: new Array<number>(),
        presumedNoService: new Array<number>(),
        officialDelays: new Array<number>(),
        officialNoService: new Array<number>(),
    } as IRoute;
}