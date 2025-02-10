import { ITimePeriodDocument } from "../../../types/lib/db/TimePeriods/types.js"
import { IDatabase } from "../../../types/lib/db/UserMangement/types.js"
import timePeriodCollection from "./models.js"

export class TimePeriodDatabase{
    private timePeriodCollection
    private database : IDatabase
    constructor(database : IDatabase, gameCollectionName : string = "timePeriod")
    {
        if(!database)
        {
            throw new Error("Mongoose database object missing")
        }
        this.database = database
        this.timePeriodCollection = timePeriodCollection(database, gameCollectionName)
    }
    async getTimePeriods(): Promise<ITimePeriodDocument[]> {
        const connectionStatus = await this.database.connectToDatabase()
        let result : ITimePeriodDocument[] = []
        if(connectionStatus)
        {
            try{
                result = await this.timePeriodCollection.find()
            }
            catch(e : any)
            {
                console.error(e)
            }
        }
        return result
    }
}