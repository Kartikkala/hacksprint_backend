import { Model } from 'mongoose';
import { IGameEventDocument } from '../../../types/lib/db/GameEvents/types.js'; // assuming this is where IGameEventDocument interface resides
import { IDatabase } from '../../../types/lib/db/UserMangement/types.js';
import { gameEventSchema } from './schema.js'; // assuming the schema function is exported with this name and located in this file path

export default function gameEventsCollection(mongoose: IDatabase, eventCollectionName: string): Model<IGameEventDocument> {
    return mongoose.model('GameEvent', gameEventSchema(mongoose), eventCollectionName);
}
