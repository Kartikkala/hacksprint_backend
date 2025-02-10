import GameEventModel from './models.js'; 
import { IGameEventDocument, IGameEventsDatabase } from '../../../types/lib/db/GameEvents/types.js';
import { IGameEvent } from '../../../types/lib/gamesManagement/game.js';
import { Model, Types } from 'mongoose';
import { IDatabase } from '../../../types/lib/db/UserMangement/types.js';
import { IGame } from '../../../types/lib/gamesManagement/game.js';

export class GameEventsDatabase implements IGameEventsDatabase{
    private gameEventCollection: Model<IGameEventDocument>;
    private database: IDatabase;
    
    constructor(database: IDatabase, eventCollectionName: string) {
        if(!database){
            throw new Error("Mongoose database object missing");
        }
        this.database = database;
        this.gameEventCollection = GameEventModel(database, eventCollectionName);
    }
    
    async getGameEvents(): Promise<(IGameEventDocument & { game: IGame })[]> {
    const connectionStatus = await this.database.connectToDatabase();
    let result: (IGameEventDocument & { game: IGame })[] = [];
    
    if(connectionStatus)  {
        try{
            // Eagerly populate the 'game' field with game data from Games collection
            result = await this.gameEventCollection.find()
        } catch(e){
            console.error(e);
         }
     }
    return result;
    }
    
    async createGameEvent(gameEvent: IGameEvent): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase();
        if(connectionStatus) {
            try{
                let sanitizedEvent : IGameEventDocument = {
                    eventId : gameEvent.eventId,
                    players : gameEvent.players,
                    eventDateTime : String(gameEvent.eventDateTime),
                    gameId : gameEvent.game.gameId,
                    prizepool : gameEvent.prizepool,
                    fee : gameEvent.fee
                };
                await this.gameEventCollection.create(sanitizedEvent);
                return true;
            } catch(e){
                console.error(e);
            }
        }
        
        return false;
    }
    
    async endGameEvent(gameEvent: IGameEvent): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase();
        if(connectionStatus) {
            try{
                await this.gameEventCollection.deleteOne({eventId : gameEvent.eventId})
                return true;
            } catch(e){
                console.error(e);
            }
        }
        
        return false;
    }
    
    async updatePlayers(gameEventId: string, players : Map<string, string[]>): Promise<boolean>  {
        const connectionStatus = await this.database.connectToDatabase();
        
        if (connectionStatus)   {
            try  {
                await this.gameEventCollection.updateOne({ eventId: gameEventId }, { $set: { players : players} }); 
                return true;
             } catch (e)  {
                console.error(e);
            }
        }
        
        return false;
    }
}
