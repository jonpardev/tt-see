import { Types, Model, Schema, model } from "mongoose";
import { ILine, lineSchema } from "./line.models";

export interface IMap {
    _id: Types.ObjectId;
    lines: ILine[];
    createdAt: Date;
}

// TMethodsAndOverrides
type MapDocumentProps = {
    lines: Types.DocumentArray<ILine>;
}
type MapModelType = Model<IMap, {}, MapDocumentProps>;

const mapSchema = new Schema<IMap, MapModelType>({
    lines: [lineSchema],
    createdAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now()),
    },
}, {
    collection: 'map'
});


export const Map = model<IMap, MapModelType>('Map', mapSchema);