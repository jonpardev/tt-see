import { ILineDto, IMap, IMapDto } from "../models/map.model";
import IRoute from "../models/route.model";

export enum Keys {
    map = 'map',
    lines = 'lines',
    routes = 'routes',
    alertsUpdatedAt = 'alertsUpdatedAt'
}

export const getMap = async () => {
    const mapString = localStorage.getItem(Keys.map);
    if (mapString) {
        return JSON.parse(mapString) as IMap;
    }
    return undefined;
}

export const setMap = async (map: IMap) => {
    localStorage.setItem(Keys.map, JSON.stringify(map));
}

export const getLines = async () => {
    const linesString = localStorage.getItem(Keys.lines);
    if (linesString) {
        return JSON.parse(linesString) as ILineDto[];
    }
    return undefined;
}

export const setLines = async (linesDtos: ILineDto[]) => {
    localStorage.setItem(Keys.lines, JSON.stringify(linesDtos));
}

export const setMapLines = async (mapDto: IMapDto) => {
    const map: IMap = {
        _id: mapDto._id,
        updatedAt: mapDto.updatedAt,
    }
    setMap(map);
    setLines(mapDto.lines);
}

export const getRoutes = async () => {
    const routesString = localStorage.getItem(Keys.routes);
    if (routesString) {
        return JSON.parse(routesString) as IRoute[];
    }
    return undefined;
}

export const setRoutes = async (routes: IRoute[]) => {
    localStorage.setItem(Keys.routes, JSON.stringify(routes));
}

export const getAlertsUpdatedAt = async () => {
    const updatedAtString = localStorage.getItem(Keys.alertsUpdatedAt);
    if (updatedAtString) {
        return Number.parseInt(updatedAtString);
    }
    return undefined;
}

export const setAlertsUpdatedAt = async (alertUpdatedAt: number) => {
    localStorage.setItem(Keys.alertsUpdatedAt, alertUpdatedAt.toString());
}