import { TimePeriodDatabase } from '../db/TimePeriod/db.js'

export class TimePeriod{
    public timePeriodId : string
    public name : string
    constructor(gameId: string, name : string)
    {
        this.timePeriodId = gameId
        this.name = name;
    }
}

export default class TimePeriodManager{  
    private timePeriodArray : Array<TimePeriod>
    private static gameManagerInstance : TimePeriodManager | undefined = undefined

    private constructor(timePeriodArray : Array<TimePeriod>){
        this.timePeriodArray = timePeriodArray
    }

    public static async getInstance(database : TimePeriodDatabase) : Promise<TimePeriodManager>
    {        
        const timePeriodDocumentArray = await database.getTimePeriods()
        const timePeriodArray = []
        for(let i=0;i<timePeriodDocumentArray.length;i++)
        {
            const timePeriodObject = new TimePeriod(String(timePeriodDocumentArray[i].timePeriodId), String(timePeriodDocumentArray[i].name));
            timePeriodArray.push(timePeriodObject)
        }
        if(!this.gameManagerInstance){
            this.gameManagerInstance = new TimePeriodManager(timePeriodArray);
        }
        return this.gameManagerInstance
    }

    public getAllTimePeriods()
    {
        return this.timePeriodArray
    }

    public getTimePeriodWithId(timePeriodId : string)
    {
        for(let i=0;i<this.timePeriodArray.length;i++)
        {
            if(timePeriodId === this.timePeriodArray[i].timePeriodId)
            {
                return this.timePeriodArray[i]
            }
        }
        return null
    }
}