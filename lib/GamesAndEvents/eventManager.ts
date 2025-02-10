import { IGame, IGameEvent } from "../../types/lib/gamesManagement/game.js"
import {IGameEventsDatabase} from "../../types/lib/db/GameEvents/types.js"
import {EventEmitter} from "events"
import {IGameManager} from "../../types/lib/gamesManagement/game.js"
import crypto from 'crypto'


class GameEvent extends EventEmitter implements IGameEvent{
  public readonly game : IGame;
  public readonly players: Map<string, string[]> = new Map();
  private _eventStatus : boolean = false
  public readonly eventId : string
  public roomId : string | undefined
  private _prizepool : number
  private _fee : number
  private _eventDateTime : string
  
  constructor(game: IGame, prizepool : number = 0, eventDateTime : string ,fee : number = 0, eventId : string = crypto.randomUUID().toString(), players?: Map<string, string[]>) {
    super();
    this.game = game;
    this._prizepool = prizepool
    this.eventId = eventId                       
    this._fee = fee
    this._eventDateTime = eventDateTime
    
    if(players !== undefined)
      {
        this.players = players
    }
  }
  
  public publishRoomID(roomId: string): void  {
    console.log('Room ID published: ', roomId);
    this.roomId = roomId
    this.emit('event', roomId, Array.from(this.players));
  }

  public declareWinner(inGameId : string)
  {
    const playersArray = Array.from(this.players.values())
    for(let i=0;i<playersArray.length;i++)
    {
      const playerArray = playersArray[i]
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


  public addPlayer(email: string, inGameId : string): boolean {
    if(this.players.size <= (this.game.maxTeams * this.game.maxTeamMembers) && !this.players.has(this.sanitize(email)))
    {
      this.players.set(this.sanitize(email), [email, inGameId]);
      return true;
    }
    return false
  }
  
  public removePlayer(email: string): boolean {
    return this.players.delete(email);
  }

  public changeEventStatus() : boolean
  {
    this._eventStatus = !this._eventStatus
    return this._eventStatus
  }

  public get eventStatus(): boolean {
    return this._eventStatus
  }

  public set prizepool(value : number)
  {
    value >= 0 ? (this._prizepool = value): null
  }

  public get eventDateTime() : string {
    return this._eventDateTime
  }

  public get prizepool()
  {
    return this._prizepool
  }

  public get fee()
  {
    return this._fee
  }
}

export class GameEventsManager {
  private static instance: GameEventsManager;
  private eventsMap: Map<string, IGameEvent> = new Map()
  private database: IGameEventsDatabase

  private constructor(db: IGameEventsDatabase, events : IGameEvent[]) { // Constructor receives the db
    this.database = db; // Save it in an instance variable
    for (let event of events) {
      this.eventsMap.set(event.eventId, event)
    }
  }
  
  public static async getInstance(db: IGameEventsDatabase, gameManager : IGameManager): Promise<GameEventsManager> {
    if (!GameEventsManager.instance) {
      const eventDocuments = await db.getGameEvents()
      const events : IGameEvent[] = []
      eventDocuments.forEach(eventDocument => {
        const game = gameManager.getGameWithId(eventDocument.gameId.toString())
        let event : IGameEvent
        if(game)
        {
          event = new GameEvent(game, eventDocument.prizepool, eventDocument.eventDateTime ,eventDocument.fee , eventDocument.eventId.toString() ,eventDocument.players) // Get the game from the gameManager and pass here
          events.push(event)
        }
      });
      GameEventsManager.instance = new GameEventsManager(db, events);
     }
    return GameEventsManager.instance;
  }

  // Method to create a new game event
  public async createEvent(game: IGame ,prizepool : number = 0, eventDateTime : string ,fee : number=0): Promise<IGameEvent | undefined> {
      const newEvent = new GameEvent(game, prizepool, eventDateTime ,fee);
      if(await this.database.createGameEvent(newEvent))
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
  public getEvent(eventId : string): IGameEvent | undefined {
    return this.eventsMap.get(eventId);
  }

  // Method to delete a game event
  public async deleteEvent(eventId : string): Promise<Boolean | {players : Map<string, string[]>, fee : number, status : boolean}> {
    const event = this.eventsMap.get(eventId)
    if(event)
    {
      await this.database.endGameEvent(event);
      if(event)
      {
        const playerDetails = {
          players : event.players,
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
    
    if (event && event.addPlayer(email, inGameId)){
      await this.database.updatePlayers(eventId, event.players);
      return true;
    } 
    return false
  }
    
}
