import { Schema, model, Types } from "mongoose";

export enum Status {
    Dismissed = "DISMISSED",
    OfficialDelays = "OFFICIAL_DELAYS",
    OfficialNoService = "OFFICIAL_NO_SERVICE",
    NeedToCheck = "NEED_TO_CHECK",
}

export interface IAlertDto {
    line_id: Types.ObjectId;
    status: Status;
    station_ids: Types.ObjectId[];
    messages: string[];
}

export interface IAlert extends IAlertDto {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const alertSchema = new Schema<IAlert>({
    line_id: {
        type: Schema.Types.ObjectId,
        ref: 'Map.lines',
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    station_ids: {
        type: [Schema.Types.ObjectId],
        ref: 'Map.lines.stations',
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => new Date(Date.now()),
        required: true,
    },
    updatedAt: {
        type: Date,
        default: () => new Date(Date.now()),
        required: true,
    },
    messages: {
        type: [String],
        required: true,
    }
}, {
    collection: 'alerts',
});

export const Alert = model<IAlert>('Alert', alertSchema);