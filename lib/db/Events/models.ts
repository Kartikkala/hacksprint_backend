import { Model } from 'mongoose';
import { IDatabase } from '../../../types/lib/db/UserMangement/types.js';
import { ITimePeriodEventDocument } from '../../../types/lib/db/TimePeriodEvents/types.js';
import { timePeriodEventSchema } from './schema.js';

export default function timePeriodEventsCollection(mongoose: IDatabase, eventCollectionName: string): Model<ITimePeriodEventDocument> {
    return mongoose.model('TimePeriodEvent', timePeriodEventSchema(mongoose), eventCollectionName);
}
