import { Types, Model, Schema, model } from "mongoose";
import { ILine, lineSchema } from "./line.models";

export interface IMap {
    _id: number;
    lines: ILine[];
}

// TmethodsAndOverrides for subdocumenting
type MapDocumentProps = {
    _id: number;
    lines: Types.DocumentArray<ILine>;
}
type MapModelType = Model<IMap, {}, MapDocumentProps>;

const mapSchema = new Schema<IMap, MapModelType>({
    _id: {
        type: Number,
        required: true,
    },
    lines: [lineSchema],
}, {
    collection: 'map'
});


export const Map = model<IMap, MapModelType>('Map', mapSchema);