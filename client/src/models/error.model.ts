export enum ErrorCode {
    BackendNoResponse = 101,
    BackendResponseButNoData = 102,
    OtherAxiosErrors = 103,
}

export default class ErrorWithCode extends Error {
    constructor(
        code: ErrorCode,
        message: string,
    ){
        super(message);
        this.code = code;
        if (code) this.message = `[ERR${this.code}] ${message}`;
    };

    code: ErrorCode;
}