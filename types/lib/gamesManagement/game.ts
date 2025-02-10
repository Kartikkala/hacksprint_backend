export interface IGame{
    gameId : string
    name : string
    type : boolean
    maxTeams : number
    maxTeamMembers : number
    imageBanner? : Buffer
    modeName? : string
}

export interface IGameEvent{
    game : IGame,
    eventDateTime : String,
    players: Map<string, string[]> ,
    eventStatus : boolean,
    eventId : string,
    roomId : string | undefined,
    prizepool : number,
    fee : number,
    publishRoomID(roomId: string): void,
    declareWinner(inGameId : string) : string | null,
    changeEventStatus() : boolean,
    addPlayer(email: string, playerId : string): boolean,
    removePlayer(email: string): boolean,
}

export interface IGameManager {
    getAllGames() : Array<IGame>
    createNewGame(name: string, type: boolean, maxTeams?: number, maxTeamMembers?: number, modeName?: string, imageBanner?: Buffer): Promise<boolean>;
    updateGame(targetGameId: string, name?: string, type?: boolean, maxTeams?: number, maxTeamMembers?: number, modeName?: string, imageBanner?: Buffer): Promise<boolean>;
    deleteGame(targetGameId: string): Promise<boolean>;
    getGameWithId(gameId : string) : IGame | undefined
}


export interface IGameAndEventsManagerFactory {
    createEvent(game: IGame, prizepool: number, eventDateTime : string ,fee? : number): Promise<IGameEvent | undefined>;
    getEvent(eventId: string): IGameEvent | undefined;
    deleteEvent(eventId: string): Promise<Boolean | {players : Map<string, string[]>, fee : number, status : boolean}>;
    getAllEvents() : Array<IGameEvent>,
    registerPlayerForEvent(eventId : string, newPlayerInGameId : string ,email : string) : Promise<Boolean>,
    getWinnerDetails(eventId : string, playerInGameId : string) : null | string | undefined,
    
    getGameWithId(gameId  : string)  : IGame | undefined
    createNewGame(name: string, type: boolean, maxTeams?: number, maxTeamMembers?: number, modeName?: string, imageBanner?: Buffer): Promise<boolean>;
    updateGame(targetGameId: string, name?: string, type?: boolean, maxTeams?: number, maxTeamMembers?: number, modeName?: string, imageBanner?: Buffer): Promise<boolean>;
    deleteGame(targetGameId: string): Promise<boolean>;
    getAllGames() : Array<IGame>
}