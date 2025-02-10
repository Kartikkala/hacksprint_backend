export interface ITimePeriod{
    timePeriodId : string
    name : string
}

export interface ITimePeriodEvent{
    timePeriod : ITimePeriod,
    eventDateTime : String,
    users: Map<string, string[]> ,
    eventStatus : boolean,
    eventId : string,
    eventVenue : string,
    fee : number,
    // publishRoomID(roomId: string): void,
    declareWinner(inGameId : string) : string | null,
    changeEventStatus() : boolean,
    addUser(email: string, playerId : string): boolean,
    removeUser(email: string): boolean,
}



