import {EventEmitter} from "events"
import crypto from 'crypto'
import { ITimePeriod, ITimePeriodEvent } from "../../types/lib/timePeriodManagement/game.js";
import { TimePeriodDatabase } from "../db/TimePeriod/db.js";
import TimePeriodManager, { TimePeriod } from "./timePeriodManager.js";
import { TimePeriodEventsDatabase } from "../db/Events/db.js";


export class TimePeriodEvent extends EventEmitter{
  public readonly timePeriod : ITimePeriod;
  public readonly users: Map<string, string[]> = new Map();
  private _eventStatus : boolean = false
  public readonly eventId : string
  public roomId : string | undefined
  public eventVenue : string
  private _fee : number
  private _eventDateTime : string
  
  constructor(timePeriod: ITimePeriod, eventVenue : string , eventDateTime : string ,fee : number = 0, eventId : string = crypto.randomUUID().toString(), users?: Map<string, string[]>) {
    super();
    this.timePeriod = timePeriod;
    this.eventId = eventId                       
    this._fee = fee
    this.eventVenue = eventVenue
    this._eventDateTime = eventDateTime
    
    if(users !== undefined)
      {
        this.users = users
    }
  }
  

  public declareWinner(inGameId : string)
  {
    const usersArray = Array.from(this.users.values())
    for(let i=0;i<usersArray.length;i++)
    {
      const playerArray = usersArray[i]
        if(playerArray[1] === inGameId)
        {
          return playerArray[0] // Return the player's email address
        }
    }
    return null
  }

  private sanitize(STRING : string)
  {
    return STRING.replace(/\./g, '');
  }


  public addUser(email: string, inGameId : string): boolean {
    if(!this.users.has(this.sanitize(email)))
    {
      this.users.set(this.sanitize(email), [email, inGameId]);
      return true;
    }
    return false
  }
  
  public removeUser(email: string): boolean {
    return this.users.delete(email);
  }

  public changeEventStatus() : boolean
  {
    this._eventStatus = !this._eventStatus
    return this._eventStatus
  }

  public get eventStatus(): boolean {
    return this._eventStatus
  }


  public get eventDateTime() : string {
    return this._eventDateTime
  }

  public get fee()
  {
    return this._fee
  }
}

export class TimePeriodEventsManager {
  private static instance: TimePeriodEventsManager;
  private eventsMap: Map<string, TimePeriodEvent> = new Map()
  private database: TimePeriodEventsDatabase

  private constructor(db: TimePeriodEventsDatabase, events : TimePeriodEvent[]) { // Constructor receives the db
    this.database = db; // Save it in an instance variable
    for (let event of events) {
      this.eventsMap.set(event.eventId, event)
    }
  }
  
  public static async getInstance(db: TimePeriodEventsDatabase, timePeriodManager : TimePeriodManager): Promise<TimePeriodEventsManager> {
    if (!this.instance) {
      const eventDocuments = await db.getTimePeriodEvents()
      const events : TimePeriodEvent[] = []
      eventDocuments.forEach(eventDocument => {
        const timePeriod = timePeriodManager.getTimePeriodWithId(eventDocument.eventId.toString())
        let event : TimePeriodEvent
        if(timePeriod)
        {
          event = new TimePeriodEvent(timePeriod, String(eventDocument.eventVenue), eventDocument.eventDateTime ,eventDocument.fee , eventDocument.eventId.toString() ,eventDocument.users) // Get the game from the gameManager and pass here
          events.push(event)
        }
      });
      TimePeriodEventsManager.instance = new TimePeriodEventsManager(db, events);
     }
    return TimePeriodEventsManager.instance;
  }

  // Method to create a new game event
  public async createEvent(timePeriod : TimePeriod , eventDateTime : string , eventVenue: string, fee : number=0): Promise<TimePeriodEvent | undefined> {
      const newEvent = new TimePeriodEvent(timePeriod, eventVenue ,eventDateTime ,fee);
      if(await this.database.createTimePeriodEvent(newEvent))
      {
        this.eventsMap.set(newEvent.eventId, newEvent);
        return newEvent;
      }
      return undefined
  }

  public getAllEvents()
  {
    return Array.from(this.eventsMap.values())
  }

  // Method to retrieve an existing game event by its id
  public getEvent(eventId : string): TimePeriodEvent | undefined {
    return this.eventsMap.get(eventId);
  }

  // Method to delete a game event
  public async deleteEvent(eventId : string): Promise<Boolean | {users : Map<string, string[]>, fee : number, status : boolean}> {
    const event = this.eventsMap.get(eventId)
    if(event)
    {
      await this.database.endTimePeriodEvent(event);
      if(event)
      {
        const playerDetails = {
          users : event.users,
          fee : event.fee,
          status : event.eventStatus
        }
        this.eventsMap.delete(eventId)
        return playerDetails
      }
    }
    return false;
  }

  public getWinnerDetails(eventId : string, playerInGameId : string) : null | string | undefined
  {
    return this.getEvent(eventId)?.declareWinner(playerInGameId)
  }

  public async registerForEvent(email: string, inGameId : string ,eventId: string): Promise<boolean> {
    const event = this.getEvent(eventId)
    
    if (event && event.addUser(email, inGameId)){
      await this.database.updateUsers(eventId, event.users);
      return true;
    } 
    return false
  }
    
}
