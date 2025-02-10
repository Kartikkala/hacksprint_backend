import { Model } from 'mongoose';
import { IDatabase } from '../../../types/lib/db/UserMangement/types.js';
import { coinPackSchema } from './schema.js';
import { ICoinPackDocument } from '../../../types/lib/db/CoinPacks/types.js';

export default function coinPackCollection(mongoose: IDatabase, currencyCollectionName: string): Model<ICoinPackDocument> {
    return mongoose.model('CoinPack', coinPackSchema(mongoose), currencyCollectionName);
}
