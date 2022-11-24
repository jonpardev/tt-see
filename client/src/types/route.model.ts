import { ILine } from "./map.model";

export default interface IRoute {
    order: number;
    line: ILine;
    stations: string[];
    messages: string[];
    officialDelays: string[];
    officialNoService: string[];
    needToCheck: string[];
}