import CoinPackModel from "./models.js";
import { IDatabase } from "../../../types/lib/db/UserMangement/types";
import { Types, Model } from "mongoose";
import { ICoinPackDocument, ICoinPacksDatabase } from "../../../types/lib/db/CoinPacks/types";

export class CoinPacksDatabase implements ICoinPacksDatabase {
    private coinPackCollection: Model<ICoinPackDocument>;
    private database: IDatabase;
    
    constructor(database: IDatabase, coinPacksCollectionName: string)  {
        if(!database){
            throw new Error("Mongoose database object missing");
         }
        this.database = database;
        this.coinPackCollection = CoinPackModel(database, coinPacksCollectionName);
    }
    
    async getCoinPacks(): Promise<ICoinPackDocument[]> {
        const connectionStatus  = await this.database.connectToDatabase();
        let result: ICoinPackDocument[] = [];
        
        if(connectionStatus)  {
            try{
                // Fetch the coin packs data from CoinPacks collection
                result = await this.coinPackCollection.find();
             } catch(e){
               console.error(e);
            }
          }
        return result;
    }
    
    async createCoinPack(coins: number, price: number): Promise<boolean> {
        const connectionStatus  =  await this.database.connectToDatabase();
        
        if (connectionStatus)  {
           try{
                // Create a new coin pack in CoinPacks collection
                let newCoinPack = {coins, price};
                await this.coinPackCollection.create(newCoinPack);
                return true;
              } catch(e){
               console.error(e);
             }
           }
        return false;
    }
    
    async deleteCoinPack(id: string): Promise<boolean> {
        const connectionStatus  = await this.database.connectToDatabase();
        
        if(connectionStatus)  {
           try{
               // Delete the coin pack from CoinPacks collection by id
               await this.coinPackCollection.deleteOne({ _id: new Types.ObjectId(id) });
               return true;
            } catch(e){
               console.error(e);
            }
         }
        return false;
    }
    
    async updateCoinPack(id: string, coins: number, price: number): Promise<boolean> {
        const connectionStatus  =  await this.database.connectToDatabase();
        
        if (connectionStatus)  {
            try{
                // Update the coin pack in CoinPacks collection by id with new data
                let updatedCoinPack = {coins, price};
                await this.coinPackCollection.updateOne({ _id: new Types.ObjectId(id) }, updatedCoinPack);
                return true;
              } catch(e){
               console.error(e);
             }
           }
        return false;
    }
}
