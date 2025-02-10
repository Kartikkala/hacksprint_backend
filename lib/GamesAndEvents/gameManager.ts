import { IGameDatabase } from "../../types/lib/db/Games/types.js"
import crypto from 'crypto'
import { IGame } from "../../types/lib/gamesManagement/game.js"
import { IGameManager } from "../../types/lib/gamesManagement/game.js"

class Game{
    public gameId : string
    public name : string
    public type : boolean
    public maxTeams : number
    public maxTeamMembers : number
    public imageBanner? : Buffer
    public modeName? : string
    constructor(gameId: string, name : string, type : boolean, maxTeams : number = 2, maxTeamMembers : number = 1, modeName? : string, imageBanner? : Buffer)
    {
        this.gameId = gameId
        this.name = name
        this.type = type
        this.maxTeams = maxTeams
        this.maxTeamMembers = maxTeamMembers
        this.modeName = modeName
        this.imageBanner = imageBanner
    }
}


export default class GameManager implements IGameManager{   // Create an interface IGameManager
    private gameMap : Map<string, IGame>
    private database : IGameDatabase
    private static gameManagerInitializerKey = Symbol("UniqueGameManagerKey")
    private static gameManagerInstance : GameManager | undefined = undefined

    constructor(gameManagerKey : Symbol, gameArray : Map<string, IGame>, database : IGameDatabase){
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

    public async createNewGame(name : string, type : boolean, maxTeams : number = 2, maxTeamMembers : number = 1, modeName? : string, imageBanner? : Buffer)
    {
        const gameId = crypto.randomUUID()
        const game = new Game(gameId, name, type, maxTeams, maxTeamMembers, modeName, imageBanner)
        const result = await this.database.addGame(game)
        if(result)
        {
            this.gameMap.set(gameId, game)
        }
        return result
    }

    public async updateGame(targetGameId : string, name? : string, type? : boolean, maxTeams? : number, maxTeamMembers? : number, modeName? : string, imageBanner? : Buffer)
    {
        let updatedGameObject : Game
        const targetGame = this.gameMap.get(targetGameId)

        if(targetGame)
        {
            const u_name = name || targetGame.name
            const u_imageBanner = imageBanner || targetGame.imageBanner
            const u_type = type || targetGame.type
            const u_maxTeamMembers = maxTeamMembers || targetGame.maxTeamMembers
            const u_maxTeams = maxTeams || targetGame.maxTeams
            const u_modeName = modeName || targetGame.modeName
            updatedGameObject = new Game(targetGameId ,u_name, u_type, u_maxTeams, u_maxTeamMembers, u_modeName, u_imageBanner)
            if(await this.database.updateGame(targetGame, updatedGameObject))
            {
                this.gameMap.set(targetGameId, updatedGameObject)
                return true
            }
        }
        return false
    }

    public async deleteGame(targetGameId : string)
    {
        const targetGame = this.gameMap.get(targetGameId)
        if(targetGame)
        {
            if(await this.database.removeGame(targetGame))
            {
                this.gameMap.delete(targetGameId)
                return true
            }
        }
        return false
    }

    public getGameWithId(gameId : string) : IGame | undefined
    {
        return this.gameMap.get(gameId);
    }

    public getAllGames()
    {
        return Array.from(this.gameMap.values())
    }
}