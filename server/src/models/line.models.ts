import { Types, Model, Schema } from "mongoose";
import { IStation, stationSchema } from "./station.model";

export interface ILine {
    _id: Types.ObjectId;
    type: "subway" | "bus" | "streetcar";
    number: string;
    name: string;
    stations: IStation[];
    bgColor?: string;
    textColor?: string;
}

// TMethodsAndOverrides
type LineDocumentProps = {
    stations: Types.DocumentArray<IStation>;
}
type LineModelType = Model<ILine, {}, LineDocumentProps>;

export const lineSchema = new Schema<ILine, LineModelType>({
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