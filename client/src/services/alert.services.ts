import backendApi from "../config/api";
import { AlertsResponse } from "../types/alert.model";
import ErrorWithCode, { ErrorCode } from "../types/error.model";

export const getAll = async () => {
    try {
        const response = await backendApi.get<AlertsResponse>('/alerts');
        if (!response.data) throw new ErrorWithCode(ErrorCode.BackendResponseButNoData, "There is a problem on the remote server.");
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) throw error;
        else throw new ErrorWithCode(ErrorCode.BackendNoResponse, "There is an unexpected problem on the remote server.");
    }
}