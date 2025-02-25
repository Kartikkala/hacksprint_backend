import { IJwtPayload } from '../../types/lib/authentication/jwt/helper/types'; // assuming types are defined somewhere else
import TimePeriodAndEventsManagerFactory from '../TimePeriodAndEvents';

export class Admin {
    private static instance: Admin; // singleton instance
    
    constructor(private timePeriodAndEventsManagerFactory: TimePeriodAndEventsManagerFactory) { }
    
    public static getInstance(timePeriodAndEventsManagerFactory : TimePeriodAndEventsManagerFactory): Admin {
        if (!Admin.instance) {
            Admin.instance = new Admin(timePeriodAndEventsManagerFactory); 
        }
        
        return Admin.instance;
    }
    
    public createTimePeriodEvent(user : IJwtPayload, timePeriodId : string, eventDateTime : string,eventVenue : string ,fee : number = 0) {
        if (user.admin) {
            const timePeriod = this.timePeriodAndEventsManagerFactory.getTimePeriodWithId(timePeriodId)
            if(timePeriod)
            {
                return this.timePeriodAndEventsManagerFactory.createEvent(timePeriod, eventDateTime, eventVenue ,fee);
            }
        } else {
            throw new Error("User is not an admin");
        }
    }
    
    public createGame(user : IJwtPayload, name : string, type : boolean, modeName? : string, maxTeamMembers? : number, maxTeams? : number, imageBanner? : Buffer) {
        if (user.admin) {
            return this.timePeriodAndEventsManagerFactory.createEvent(name, type, maxTeams, maxTeamMembers,modeName, imageBanner);
        } else {
            throw new Error("User is not an admin");
        }
    }

    public getGames(user : IJwtPayload)
    {
        if(user.admin)
        {
            return this.timePeriodAndEventsManagerFactory.getAllGames()
        }
        else{
            throw new Error("User is not an admin");
        }
    }

    public updateGame(user : IJwtPayload, gameId: string, name?:string, type?:boolean, modeName?:string, maxTeamMembers?:number, maxTeams?:number, imageBanner?:Buffer){
        if(user.admin) {
            const game = this.timePeriodAndEventsManagerFactory.getGameWithId(gameId);
            if (game){
                return this.timePeriodAndEventsManagerFactory.updateGame(gameId, name, type, maxTeams, maxTeamMembers, modeName, imageBanner);
            } else {
                throw new Error("No game with given id exists");
            }
        }
    }

    public deleteGame(user: IJwtPayload, gameId: string){
        if (user.admin) {
            return this.gamesAndEvents.deleteGame(gameId);
        } else {
            throw new Error("User is not an admin");
        }
    }

    public publishRoomId(user : IJwtPayload, eventId : string, roomId : string) : Boolean
    {
        if(user.admin)
        {
            
            const event = this.gamesAndEvents.getEvent(eventId)
            if(event)
            {
                
                event.publishRoomID(roomId)
                event.changeEventStatus()
                return true
            }
        }
        else
        {
            throw new Error("User is not an admin");
        }
        return false
    }

    public deleteEvent(user: IJwtPayload, eventId: string){
        if (user.admin)  {
            return this.gamesAndEvents.deleteEvent(eventId);
        } else  {
            throw new Error("User is not an admin");
        }
    }
}
