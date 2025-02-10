import { Schema } from "mongoose"
import {ITimePeriodDocument} from "../../../types/lib/db/TimePeriods/types.js"
import { IDatabase } from "../../../types/lib/db/UserMangement/types.js"


export function timePeriodSchema(mongoose : IDatabase) : Schema<ITimePeriodDocument>
{
    return new mongoose.Schema<ITimePeriodDocument>({
        timePeriodId : {
            type : String,
            required : true,
            unique : true
        }, 
        name : String
    })
}

