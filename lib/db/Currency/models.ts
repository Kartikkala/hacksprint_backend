import { Model } from 'mongoose';
import { IDatabase } from '../../../types/lib/db/UserMangement/types.js';
import { currencySchema } from './schema.js'; // assuming the schema function is exported with this name and located in this file path
import { ICurrencyDocument } from '../../../types/lib/db/Currency/types.js';

export default function currencyCollection(mongoose: IDatabase, currencyCollectionName: string): Model<ICurrencyDocument> {
    return mongoose.model('Currency', currencySchema(mongoose), currencyCollectionName);
}
