// lib/db/termsAndConditions/schema.ts
import { Schema } from 'mongoose';
import { ITermsAndConditionsByVersion, ITermsAndConditionsDocument } from '../../../types/lib/db/termsAndConditions/types';

export function termsAndConditionsSchema(): Schema<ITermsAndConditionsDocument> {
  return new Schema<ITermsAndConditionsDocument>({
    userEmail: {
      type: String,
      required: true,
    },
    signedAt: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: String,
      required: true,
    },
  });
}

export function termsAndConditonsByVersion() : Schema<ITermsAndConditionsByVersion>
{
    return new Schema<ITermsAndConditionsByVersion>({
        version : {
            type : String,
            required : true
        },
        terms : {
            type : String,
            required : true
        }
    })
}