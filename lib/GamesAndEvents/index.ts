import { GameEventsManager } from "./eventManager.js";
import GameManager from "./gameManager.js";
import { IGameManager, IGameEvent, IGame, IGameAndEventsManagerFactory } from "../../types/lib/gamesManagement/game.js";
import { IGameEventsDatabase } from "../../types/lib/db/GameEvents/types.js";
import { IGameDatabase } from "../../types/lib/db/Games/types.js";


export default class GameAndEventsManagerFactory implements IGameAndEventsManagerFactory{
    private gameEventsManager: GameEventsManager;
    private gameManager: IGameManager;
    private static _instance: GameAndEventsManagerFactory;
    
    private constructor(gameManager : IGameManager, gameEventsManager :GameEventsManager) {
        this.gameManager = gameManager;
        this.gameEventsManager = gameEventsManager;
    }

    public static async getInstance(gameEventsDb: IGameEventsDatabase, gameManagerDb: IGameDatabase)
    {
        if (!GameAndEventsManagerFactory._instance) {
            const gameManager = await GameManager.getInstance(gameManagerDb)
            const gameEventsManager = await GameEventsManager.getInstance(gameEventsDb, gameManager)
            GameAndEventsManagerFactory._instance = new GameAndEventsManagerFactory(gameManager, gameEventsManager);
        }
        
        return GameAndEventsManagerFactory._instance;
    }
    
    // This method will create a new event using the GameEventsManager instance
    public async createEvent(game: IGame, prizepool : number, eventDateTime : string ,fee : number = 0): Promise<IGameEvent | undefined> {
        return this.gameEventsManager.createEvent(game, prizepool, eventDateTime ,fee);
    }
    
    // This method will retrieve an existing game event by its id using the GameEventsManager instance
    public getEvent(eventId: string): IGameEvent | undefined {
        return this.gameEventsManager.getEvent(eventId);
    }
    
    // This method will delete a game event using the GameEventsManager instance
    public async deleteEvent(eventId: string): Promise<Boolean | {players : Map<string, string[]>, fee : number, status : boolean}> {
        return await this.gameEventsManager.deleteEvent(eventId);
    }

    public getWinnerDetails(eventId : string, playerInGameId : string) : null | string | undefined
    {
        return this.gameEventsManager.getWinnerDetails(eventId, playerInGameId)
    }

    public async registerPlayerForEvent(eventId : string, inGameId : string ,email : string)
    {
        return await this.gameEventsManager.registerForEvent(email,inGameId ,eventId)
    }
    public getGameWithId(gameId : string)
    {
        return this.gameManager.getGameWithId(gameId)
    }
    // These methods are for managing games (create, update, delete) using the GameManager instance
    public async createNewGame(name  : string, type  : boolean, maxTeams  : number = 2, maxTeamMembers  : number = 1, modeName?  : string, imageBanner?  : Buffer) {
        return await this.gameManager.createNewGame(name, type, maxTeams, maxTeamMembers, modeName, imageBanner);
    }
    
    public async updateGame(targetGameId: string, name?: string, type?: boolean, maxTeams?: number, maxTeamMembers?: number, modeName?: string, imageBanner?: Buffer) {
        return await this.gameManager.updateGame(targetGameId, name, type, maxTeams, maxTeamMembers, modeName, imageBanner);
    }
    
    public async deleteGame(targetGameId: string){
        return await this.gameManager.deleteGame(targetGameId);
    }

    public getAllEvents()
    {
        return this.gameEventsManager.getAllEvents()
    }

    public getAllGames()
    {
        return this.gameManager.getAllGames()
    }
}
