import GameEventModel from './models.js'; 
import { ITimePeriodEventDocument } from '../../../types/lib/db/TimePeriodEvents/types.js';
import { Model } from 'mongoose';
import { IDatabase } from '../../../types/lib/db/UserMangement/types.js';
import { TimePeriodEvent } from '../../TimePeriodAndEvents/eventManager.js';
import { TimePeriod } from '../../TimePeriodAndEvents/timePeriodManager.js';

export class TimePeriodEventsDatabase{
    private gameEventCollection: Model<ITimePeriodEventDocument>;
    private database: IDatabase;
    
    constructor(database: IDatabase, eventCollectionName: string) {
        if(!database){
            throw new Error("Mongoose database object missing");
        }
        this.database = database;
        this.gameEventCollection = GameEventModel(database, eventCollectionName);
    }
    
    async getTimePeriodEvents(): Promise<(ITimePeriodEventDocument & { timePeriod: TimePeriod })[]> {
    const connectionStatus = await this.database.connectToDatabase();
    let result: (ITimePeriodEventDocument & { timePeriod: TimePeriod })[] = [];
    
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
    
    async createTimePeriodEvent(timePeriodEvent: TimePeriodEvent): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase();
        if(connectionStatus) {
            try{
                let sanitizedEvent : ITimePeriodEventDocument = {
                    eventId : timePeriodEvent.eventId,
                    users : timePeriodEvent.users,
                    eventDateTime : timePeriodEvent.eventDateTime,
                    timePeriodId : timePeriodEvent.timePeriod.timePeriodId,
                    eventVenue : timePeriodEvent.eventVenue,
                    fee : timePeriodEvent.fee
                };
                await this.gameEventCollection.create(sanitizedEvent);
                return true;
            } catch(e){
                console.error(e);
            }
        }
        
        return false;
    }
    
    async endTimePeriodEvent(timePeriodEvent: TimePeriodEvent): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase();
        if(connectionStatus) {
            try{
                await this.gameEventCollection.deleteOne({eventId : timePeriodEvent.eventId})
                return true;
            } catch(e){
                console.error(e);
            }
        }
        
        return false;
    }
    
    async updateUsers(eventId: string, users : Map<String, String[]>): Promise<boolean>{
        const connectionStatus = await this.database.connectToDatabase();
        
        if (connectionStatus)   {
            try  {
                await this.gameEventCollection.updateOne({ eventId: eventId }, { $set: { users : users} }); 
                return true;
             } catch (e)  {
                console.error(e);
            }
        }
        return false;
    }
}
