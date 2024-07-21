import { Types } from "mongoose";

export interface IReport {
    reporterId: Types.ObjectId;
    speciesName: string;
    latitude: number;
    longitude: number;
    description: string;
    photoUrl: string;
    status: 'PENDING' | 'REVIEWED' | 'VERIFIED';
}
