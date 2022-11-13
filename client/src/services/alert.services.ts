import axios, { AxiosResponse } from "axios";
import backendApi from "../config/api";
import IAlert from "../models/alert.model";
import ErrorWithCode, { ErrorCode } from "../models/error.model";

export const getAll = () => (
    new Promise<IAlert[]>((resolve, reject) => {
        backendApi.get<IAlert[]>('/alerts')
            .then((response: AxiosResponse) => {
                if (!response.data) reject(new ErrorWithCode(ErrorCode.BackendResponseButNoData, `There is a problem on the remote server.`));
                resolve(response.data);
            }).catch(error => {
                if (axios.isAxiosError(error)) reject(new ErrorWithCode(ErrorCode.BackendNoResponse, `There is a problem on the remote server.`));
            });
    }));