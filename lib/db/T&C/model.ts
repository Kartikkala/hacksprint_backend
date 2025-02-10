// lib/db/termsAndConditions/models.ts
import { Model } from 'mongoose';
import { termsAndConditionsSchema, termsAndConditonsByVersion } from './schema.js';
import { IDatabase } from '../../../types/lib/db/UserMangement/types';
import { ITermsAndConditionsByVersion, ITermsAndConditionsDocument } from '../../../types/lib/db/termsAndConditions/types';

export default function termsCollection(mongoose: IDatabase, collectionName = 'TermsAndConditions'): Model<ITermsAndConditionsDocument> {
    return mongoose.model('termsAndConditions', termsAndConditionsSchema(), collectionName);
}

export function termsWrtVersion(mongoose : IDatabase, collectionName = 'TermsByVersion') : Model<ITermsAndConditionsByVersion>
{
    return mongoose.model('termsWrtVersion', termsAndConditonsByVersion(), collectionName);
}