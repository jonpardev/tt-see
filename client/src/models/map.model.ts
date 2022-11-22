export interface IStation {
    _id: string;
    order: number;
    name: string;
}

export interface ILine {
    _id: string;
    type: "subway" | "bus" | "streetcar";
    number: string;
    name: string;
    bgColor: string;
    textColor: string;
}

export interface ILineDto extends ILine {
    stations: IStation[];
}

export interface IMap {
    _id: string;
    retrievedAt: number;
}

export interface IMapDto extends IMap {
    lines: ILineDto[];
    createdAt: number;
}