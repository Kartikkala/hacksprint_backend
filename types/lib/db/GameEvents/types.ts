import { Date, Types } from "mongoose";
import { IGameEvent } from "../../gamesManagement/game"

export interface IGameEventDocument {
    eventId: String;   // MongoDB Object ID for the GameEvent document
    eventDateTime : string,
    players: Map<string, string[]>;          // The list of user ids participating in this event
    gameId: String;   // Reference to a Game document, not collection name
    roomId?: string;           // Room Id for the event if any
    prizepool : number,
    fee : number,
}


export interface IGameEventsDatabase
{
    createGameEvent(gameEvent: IGameEvent): Promise<boolean>,
    endGameEvent(gameEvent: IGameEvent): Promise<boolean>,
    getGameEvents(): Promise<IGameEventDocument[]>,
    updatePlayers(gameEventId: string, players : Map<string, string[]>): Promise<boolean>
}
