import CurrencyModel from './models.js'; 
import { Model } from 'mongoose';
import { IDatabase } from '../../../types/lib/db/UserMangement/types.js';
import { ICurrencyDocument, ICurrencyDatabase } from '../../../types/lib/db/Currency/types.js';

export class CurrencyDatabase implements ICurrencyDatabase {
    private currencyCollection: Model<ICurrencyDocument>;
    private database: IDatabase;

    constructor(database: IDatabase, currencyCollectionName: string) {
        if (!database) {
            throw new Error("Mongoose database object missing");
        }
        this.database = database;
        this.currencyCollection = CurrencyModel(database, currencyCollectionName);
    }

    async createNewUser(emailId : string, upiId? : string)
    {
        let response = null
        if(await this.database.connectToDatabase())
            {
                // Find the user document by email and update its currency amount
                try{
                    response = await this.currencyCollection.create(
                        {emailId: emailId, 'totalMoney' : 0, upiId : upiId}
                    );
                }
                catch(e){
                    console.error(e)
                }
            }
            return response
    }

    async updateUpiId(emailId : string, upiId? : string)
    {
        if(!await this.database.connectToDatabase())
            return null
        try{
            const response = await this.currencyCollection.updateOne({emailId : emailId}, {upiId : upiId})
            return response.acknowledged
        }   
        catch(e)
        {
            console.error(e)
        }
        return false
    }

    async addCurrencyWithId(amount: number, emailId: string): Promise<ICurrencyDocument | undefined> {
        if (amount <= 0) {
            console.error("Amount to add cannot be 0!")
            return
        }
        let response


        if(await this.database.connectToDatabase())
        {
            // Find the user document by email and update its currency amount
            try{
                response = await this.currencyCollection.findOneAndUpdate(
                    {emailId: emailId},
                    {$inc: {'totalMoney': amount}},
                    {upsert : true, returnDocument:'after'}  // return the updated document
                );
            }
            catch(e){
                console.error(e)
            }
        }
        return response
    }

    async deductFromUserAccountByID(amount: number, emailId: string): Promise<ICurrencyDocument | null> {
        // Check if amount is valid
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }
        let result = null
        if(await this.database.connectToDatabase())
        {
            // Find the user document by email and update its currency amount
            result = await this.currencyCollection.findOne({emailId: emailId});
            
            if (!result) {
                throw new Error("User not found");
            } else if (result.totalMoney < amount) {
                throw new Error("Insufficient balance, transaction denied");    // Balance cannot go below 0
            } else {
                result = await this.currencyCollection.findOneAndUpdate(
                    {emailId: emailId},
                    {$inc: {'totalMoney': -amount}},
                    {new: true}   // return the updated document
                );
            }
        }
        return result;

    }

    async getTotalUserCurrencyById(emailId: string): Promise<ICurrencyDocument | null> {
        let result = null

        if(await this.database.connectToDatabase())
        {
            try{
                result = await this.currencyCollection.findOne({emailId: emailId});
                if(!result)
                {
                    result = await this.createNewUser(emailId)
                }
            }
            catch(e)
            {
                console.error(e)
            }
            
        }
        return result
    }
}
