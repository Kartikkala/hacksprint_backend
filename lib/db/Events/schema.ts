import { Schema, Types } from "mongoose";
import { IGameEventDocument } from "../../../types/lib/db/GameEvents/types.js"; // assuming this is where IGameEventDocument interface resides
import { IDatabase } from "../../../types/lib/db/UserMangement/types.js";

export function gameEventSchema(mongoose: IDatabase): Schema<IGameEventDocument> {
    return new mongoose.Schema<IGameEventDocument>({
        eventId:  {
            type: String, 
            required: true                  // This field is mandatory and every game event should refer to a game
        },
        players: {
            type : Map,
            of : [String],
        },                   // The list of user ids participating in this event
        gameId : String,
        prizepool : Number,
        fee : Number,
        roomId: {
            type : String,
            required : false
        },                     // Room Id for the event if any
        eventDateTime : String
    });
}
