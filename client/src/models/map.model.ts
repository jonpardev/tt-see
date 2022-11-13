export interface IStation {
    _id: number;
    order: number;
    name: string;
}

export interface ILine {
    _id: number;
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
    _id: number;
    updatedAt: number;
}

export interface IMapDto extends IMap {
    lines: ILineDto[];
}