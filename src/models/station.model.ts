import { Schema, Types } from "mongoose";

export interface IStation {
    _id: Types.ObjectId;
    order: number;
    name: string;
}

export const stationSchema = new Schema<IStation>({
    order: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});