import { Model } from "mongoose";
import { IGameDocument } from "../../../types/lib/db/Games/types";
import { IDatabase } from "../../../types/lib/db/UserMangement/types";
import { gameSchema } from "./schema.js";

export default function gamesCollection(mongoose : IDatabase, gameCollectionName : string) : Model<IGameDocument>
{
    return mongoose.model("game", gameSchema(mongoose), gameCollectionName)
}