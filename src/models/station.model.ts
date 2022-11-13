import { Schema } from "mongoose";

export interface IStation {
    _id: number;
    order: number;
    name: string;
}

export const stationSchema = new Schema<IStation>({
    _id: {
        type: Number,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});