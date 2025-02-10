import { Model } from "mongoose";
import { ITimePeriodDocument } from "../../../types/lib/db/TimePeriods/types";
import { IDatabase } from "../../../types/lib/db/UserMangement/types";
import { timePeriodSchema } from "./schema.js";

export default function timePeriodCollection(mongoose : IDatabase, gameCollectionName : string) : Model<ITimePeriodDocument>
{
    return mongoose.model("timePeriod", timePeriodSchema(mongoose), gameCollectionName)
}