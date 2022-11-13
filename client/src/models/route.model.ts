import { ILine } from "./map.model";

export default interface IRoute {
    order: number;
    line: ILine;
    stations: number[];
    presumedDelays: number[];
    presumedNoService: number[];
    officialDelays: number[];
    officialNoService: number[];
}