import { Schema, Types } from "mongoose";
import { IDatabase } from "../../../types/lib/db/UserMangement/types.js";
import { ICurrencyDocument } from "../../../types/lib/db/Currency/types.js";


export function currencySchema(mongoose: IDatabase): Schema<ICurrencyDocument> {
    return new mongoose.Schema<ICurrencyDocument>({
        emailId:  {
            type : String,
            required : true
        },
        totalMoney : {
            type : Number,
            default : 0,
            min : 0
        },
        upiId : {
            type : String,
            required : false
        }
    });
}
