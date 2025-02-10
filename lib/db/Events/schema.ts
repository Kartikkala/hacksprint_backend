import { Schema } from "mongoose";
import { ITimePeriodEventDocument } from "../../../types/lib/db/TimePeriodEvents/types.js"; // assuming this is where IGameEventDocument interface resides
import { IDatabase } from "../../../types/lib/db/UserMangement/types.js";

export function timePeriodEventSchema(mongoose: IDatabase): Schema<ITimePeriodEventDocument> {
    return new mongoose.Schema<ITimePeriodEventDocument>({
        eventId:  {
            type: String, 
            required: true                  // This field is mandatory and every game event should refer to a game
        },
        users: {
            type : Map,
            of : [String],
        },                   // The list of user ids participating in this event
        timePeriodId : String,
        eventVenue : String,
        fee : Number,
        eventDateTime : String
    });
}
