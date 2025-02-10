import { Schema } from "mongoose";
import { IDatabase } from "../../../types/lib/db/UserMangement/types.js";
import { ICoinPackDocument } from "../../../types/lib/db/CoinPacks/types.js";


export function coinPackSchema(mongoose: IDatabase): Schema<ICoinPackDocument> {
    return new mongoose.Schema<ICoinPackDocument>({
        coins: {
            type : Number,
            required : true,
            min : 0
        },
        price : {
            required : true,
            type : Number,
            min : 0
        }
    });
}
