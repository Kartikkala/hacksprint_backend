import { Types } from "mongoose";

export interface ICoinPackDocument{
    _id : Types.ObjectId,
    coins : number,
    price : number
}

export interface ICoinPacksDatabase {
    getCoinPacks(): Promise<ICoinPackDocument[]>;
    createCoinPack(coins: number, price: number): Promise<boolean>;
    deleteCoinPack(id: string): Promise<boolean>;
    updateCoinPack(id: string, coins: number, price: number): Promise<boolean>;
}
