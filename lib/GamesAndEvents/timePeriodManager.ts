import { IGameDatabase } from "../../types/lib/db/Games/types.js"
import crypto from 'crypto'
import { IGame } from "../../types/lib/gamesManagement/game.js"
import { IGameManager } from "../../types/lib/gamesManagement/game.js"

export class TimePeriod{
    public timePeriodId : string
    public name : string
    constructor(gameId: string, name : string)
    {
        this.timePeriodId = gameId
        this.name = name;
    }
}


export default class TimePeriodManager{  
    private gameMap : Array<TimePeriod>
    private database : IGameDatabase
    private static gameManagerInstance : TimePeriodManager | undefined = undefined

    private constructor(gameManagerKey : Symbol, gameArray : Map<string, IGame>, database : IGameDatabase){
        if(gameManagerKey !== GameManager.gameManagerInitializerKey)
        {
            throw new Error("Please use GameManager.getInstance() to create an instance.")
        }
        this.gameMap = gameArray
        this.database = database
    }

    public static async getInstance(database : IGameDatabase) : Promise<IGameManager>
    {
        let gameObjects : Map<string, IGame> = new Map();
        
        let games = await database.getGames()
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            gameObjects.set(String(game.gameId) ,new Game(String(game.gameId), String(game.name), Boolean(game.type), Number(game.maxTeams), Number(game.maxTeamMembers), game.modeName, game.imageBanner))
        }
        if(!this.gameManagerInstance){
            this.gameManagerInstance = new GameManager(this.gameManagerInitializerKey, gameObjects, database);
        }
        return this.gameManagerInstance
    }

    public getAllGames()
    {
        return Array.from(this.gameMap.values())
    }
}