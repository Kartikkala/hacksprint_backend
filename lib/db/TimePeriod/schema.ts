import { Schema } from "mongoose"
import {IGameDocument} from "../../../types/lib/db/Games/types.js"
import { IDatabase } from "../../../types/lib/db/UserMangement/types.js"


export function gameSchema(mongoose : IDatabase) : Schema<IGameDocument>
{
    return new mongoose.Schema<IGameDocument>({
        gameId : {
            type : String,
            required : true,
            unique : true
        }, 
        name : String,
        type: Boolean,
        maxTeams : Number,
        maxTeamMembers : Number,
        modeName : {
            type : String, 
            required : false
        },
        imageBanner : {
            type : Buffer,
            required : false
        }
    })
}

