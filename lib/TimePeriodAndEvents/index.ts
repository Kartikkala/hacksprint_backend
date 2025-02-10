import { TimePeriodEventsDatabase } from "../db/Events/db.js";
import { TimePeriodDatabase } from "../db/TimePeriod/db.js";
import { TimePeriodEvent, TimePeriodEventsManager } from "./eventManager.js";
import TimePeriodManager, { TimePeriod } from "./timePeriodManager.js";


export default class TimePeriodAndEventsManagerFactory{
    private timePeriodEventsManager : TimePeriodEventsManager;
    private timePeriodManager : TimePeriodManager;
    private static _instance: TimePeriodAndEventsManagerFactory;
    
    private constructor(timePeriodManager : TimePeriodManager, timePeriodEventsManager :TimePeriodEventsManager) {
        this.timePeriodEventsManager = timePeriodEventsManager;
        this.timePeriodManager = timePeriodManager;
    }

    public static async getInstance(timePeriodEventsDb : TimePeriodEventsDatabase, timePeriodDb : TimePeriodDatabase)
    {
        if (!this._instance) {
            const timePeriodManager = await TimePeriodManager.getInstance(timePeriodDb)
            const timePeriodEventsManager = await TimePeriodEventsManager.getInstance(timePeriodEventsDb, timePeriodManager)
            this._instance = new TimePeriodAndEventsManagerFactory(timePeriodManager, timePeriodEventsManager);
        }
        
        return this._instance;
    }
    
    // This method will create a new event using the GameEventsManager instance
    public async createEvent(timePeriod : TimePeriod, eventDateTime : string , eventVenue : string, fee : number = 0): Promise<TimePeriodEvent | undefined> {
        return this.timePeriodEventsManager.createEvent(timePeriod, eventDateTime ,eventVenue,fee);
    }
    
    // This method will retrieve an existing game event by its id using the GameEventsManager instance
    public getEvent(eventId: string): TimePeriodEvent | undefined {
        return this.timePeriodEventsManager.getEvent(eventId);
    }
    
    // This method will delete a game event using the GameEventsManager instance
    public async deleteEvent(eventId: string): Promise<Boolean | {users : Map<string, string[]>, fee : number, status : boolean}> {
        return await this.timePeriodEventsManager.deleteEvent(eventId);
    }

    public getWinnerDetails(eventId : string, playerInGameId : string) : null | string | undefined
    {
        return this.timePeriodEventsManager.getWinnerDetails(eventId, playerInGameId)
    }

    public async registerPlayerForEvent(eventId : string, inGameId : string ,email : string)
    {
        return await this.timePeriodEventsManager.registerForEvent(email,inGameId ,eventId)
    }
    public getTimePeriodWithId(timePeriodId : string)
    {
        return this.timePeriodManager.getTimePeriodWithId(timePeriodId)
    }

    public getAllEvents()
    {
        return this.timePeriodEventsManager.getAllEvents()
    }

    public getAllTimePeriods()
    {
        return this.timePeriodManager.getAllTimePeriods()
    }
}
