import { IGame } from "../../gamesManagement/game"

export interface ITimePeriod{
    timePeriodId : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    name : String
}

export interface IGameDatabase{
    getGames() : Promise<IGameDocument[]>,
    getGameById(id : String): Promise<IGameDocument | undefined | null>,
    addGame(game : IGame) : Promise<boolean>,
    removeGame(game : IGame) : Promise<boolean>,
    updateGame(game : IGame, newerGameObject : IGame) : Promise<boolean>
}