import { Types, Model, Schema } from "mongoose";
import { IStation, stationSchema } from "./station.model";

export interface ILine {
    _id: number;
    type: "subway" | "bus" | "streetcar";
    number: string;
    name: string;
    stations: IStation[];
    bgColor?: string;
    textColor?: string;
}

// TmethodsAndOverrides for subdocumenting
type LineDocumentProps = {
    _id: number;
    lines: Types.DocumentArray<ILine>;
}
type LineModelType = Model<ILine, {}, LineDocumentProps>;

export const lineSchema = new Schema<ILine, LineModelType>({
    _id: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    stations: [stationSchema],
    bgColor: {
        type: String,
    },
    textColor: {
        type: String,
    },
});