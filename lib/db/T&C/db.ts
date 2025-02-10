// lib/db/termsAndConditions/db.ts
import { ITermsAndConditionsByVersion, ITermsAndConditionsDatabase, ITermsAndConditionsDocument } from '../../../types/lib/db/termsAndConditions/types';
import termsCollection, {termsWrtVersion} from './model.js';
import { IDatabase } from '../../../types/lib/db/UserMangement/types';

export class TermsAndConditionsDatabase implements ITermsAndConditionsDatabase {
  private termCollection
  private termsWrtVersion
  private database: IDatabase;
  
  constructor(database: IDatabase, collectionName = 'TermsAndConditions') {
    if (!database) throw new Error('Mongoose database object missing');
    
    this.database = database;
    this.termCollection = termsCollection(database, collectionName);
    this.termsWrtVersion = termsWrtVersion(database);
  }
  
  async getTermsByVersion(version: string): Promise<ITermsAndConditionsByVersion | null> {
    const connectionStatus = await this.database.connectToDatabase();
    
    if (!connectionStatus) return null;
    
    try {
      return await this.termsWrtVersion.findOne({ version : version });
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }
  
  async signUserForTerms(version : string, email : string): Promise<boolean> {
    const connectionStatus = await this.database.connectToDatabase();
    
    if (!connectionStatus) return false;
    
    try {
      await this.termCollection.updateOne({ userEmail: email }, { version  : version }, { upsert  : true });
      return true;
    } catch (e: any) {
      console.error(e);
      return false;
    }
  }
}