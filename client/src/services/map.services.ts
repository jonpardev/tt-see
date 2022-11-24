import { AxiosResponse } from "axios";
import backendApi from "../config/api";
import ErrorWithCode, { ErrorCode } from "../types/error.model";
import { IMap, IMapDto } from "../types/map.model";

export const get = async (): Promise<AxiosResponse<IMap>> => {
    return backendApi.get<IMap>("/map");
}

export const getLatestId = async (): Promise<string> => {
    try {
        const response = await backendApi.get<string>('/map/latest');
        if (!response.data) throw new ErrorWithCode(ErrorCode.BackendResponseButNoData, `There is a problem on the remote server.`);
        return response.data as string;
    } catch(error) { throw new ErrorWithCode(ErrorCode.BackendNoResponse, `There is a problem on the remote server.`); }
}

export const getMapDto = async (): Promise<IMapDto> => {
    try {
        const response = await backendApi.get<IMapDto>("/map");
        if (response.data._id && response.data.lines) {
            const map: IMapDto = {
                _id: response.data._id,
                lines: response.data.lines,
                createdAt: response.data.createdAt,
                retrievedAt: Date.now(),
            }
            return map;
        } else throw new ErrorWithCode(ErrorCode.BackendResponseButNoData, `There is a problem on the remote server.`);
    } catch(error) { throw new ErrorWithCode(ErrorCode.BackendNoResponse, `There is a problem on the remote server.`); }
}