import { Schema, model, Date, Types } from "mongoose";

export enum Status {
    Dismissed = "DISMISSED",
    Invisible = "INVISIBLE",
    OfficialDelays = "OFFICIAL_DELAYS",
    OfficialNoService = "OFFICIAL_NO_SERVICE",
    PresumedDelays = "PRESUMED_DELAYS",
    PresumedNoService = "PRESUMED_NO_SERVICE",
}

export interface IAlert {
    _id?: Types.ObjectId,
    // map_id: number;
    line_id: number;
    station_id?: number;
    status: Status;
    createdAt?: Date;
}

const alertSchema = new Schema<IAlert>({
    _id: {
        type: Types.ObjectId,
    },
    // map_id: {
    //     type: Number,
    //     ref: 'Map',
    //     required: true,
    // },
    line_id: {
        type: Number,
        ref: 'Map.lines',
        required: true,
    },
    station_id: {
        type: Number,
        ref: 'Map.lines.stations',
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now()),
    }
}, {
    collection: 'alerts',
});

export const Alert = model<IAlert>('Alert', alertSchema);