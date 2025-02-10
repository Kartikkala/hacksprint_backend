import { IGameDatabase, IGameDocument } from "../../../types/lib/db/Games/types.js"
import { IGame } from "../../../types/lib/gamesManagement/game.js"
import { IDatabase } from "../../../types/lib/db/UserMangement/types.js"
import gamesCollection from "./models.js"

export class GameDatabase implements IGameDatabase{
    private gameCollection
    private database : IDatabase
    constructor(database : IDatabase, gameCollectionName : string = "Games")
    {
        if(!database)
        {
            throw new Error("Mongoose database object missing")
        }
        this.database = database
        this.gameCollection = gamesCollection(database, gameCollectionName)
    }
    async getGames(): Promise<IGameDocument[]> {
        const connectionStatus = await this.database.connectToDatabase()
        let result : IGameDocument[] = []
        if(connectionStatus)
        {
            try{
                result = await this.gameCollection.find()
            }
            catch(e : any)
            {
                console.error(e)
            }
        }
        return result
    }
    async getGameById(id : String): Promise<IGameDocument | undefined | null> {
        const connectionStatus = await this.database.connectToDatabase()
        let result : IGameDocument | undefined | null = undefined
        if(connectionStatus)
        {
            try{
                result = await this.gameCollection.findOne({ id : id })
            }
            catch(e : any)
            {
                console.error(e)
            }
        }
        return result
    }
    async addGame(game: IGame): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase()
        if(connectionStatus)
        {
            try{
                const newGame = {
                    "gameId" : game.gameId,
                    "name" : game.name,
                    "type" : game.type,
                    "maxTeams" : game.maxTeams,
                    "maxTeamMembers" : game.maxTeamMembers,
                    "imageBanner" : game.imageBanner,
                    "modeName" : game.modeName
                }
                await this.gameCollection.create(newGame)
                return true
            }
            catch(e)
            {
                console.error(e)
            }
        }
        return false
    }
    async removeGame(game: IGame): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase()
        if(connectionStatus)
        {
            try{
                await this.gameCollection.findOneAndDelete({gameId : game.gameId})
                return true
            }
            catch(e)
            {
                console.error(e)
            }
        }
        return false
    }
    async updateGame(game : IGame, newerGameObject: IGame): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase()
        if(connectionStatus)
        {
            try{
                const updatedGame = {
                    "gameId" : newerGameObject.gameId,
                    "name" : newerGameObject.name,
                    "type" : newerGameObject.type,
                    "maxTeams" : newerGameObject.maxTeams,
                    "maxTeamMembers" : newerGameObject.maxTeamMembers,
                    "imageBanner" : newerGameObject.imageBanner,
                    "modeName" : newerGameObject.modeName
                }
                await this.gameCollection.findOneAndUpdate({gameId : game.gameId},updatedGame)
                return true
            }
            catch(e)
            {
                console.error(e)
            }
        }
        return false
    }
}