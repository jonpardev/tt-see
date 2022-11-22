import IRoute from '../models/route.model';
import { ILineDto, IStation } from '../models/map.model';
import * as localStorageService from '../services/localStorage.services';
import * as mapService from '../services/map.services';

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
            localStorage.clear();
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

export const lineToRoute = (order:number, lineDto: ILineDto, start: IStation, end: IStation): IRoute => {
    const {stations: _, ...line} = lineDto;
    let stationIds: string[] = [];
    const stations = lineDto.stations.sort((a, b) => a.order - b.order);
    if (start.order < end.order) stationIds = stations.slice(start.order - 1, end.order).map(station => station._id);
    else if (start.order > end.order) stationIds = stations.slice(end.order - 1, start.order).sort((a, b) => b.order - a.order).map(station => station._id);
    else stationIds = [start._id];
    return {
        order: order,
        line: line,
        stations: stationIds,
        officialDelays: new Array<string>(),
        officialNoService: new Array<string>(),
        needToCheck: new Array<string>(),
    } as IRoute;
}