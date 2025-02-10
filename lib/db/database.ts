import AuthenticationDatabase from "./Authentication/db.js"
import Database from "./helper/db.js"
import { IAuthenticationDatabase } from "../../types/lib/db/Authentication/types.js"
import { IGameDatabase } from "../../types/lib/db/TimePeriods/types.js"
import { GameDatabase } from "./TimePeriod/db.js"
import { IGameEventsDatabase } from "../../types/lib/db/TimePeriodEvents/types.js"
import { GameEventsDatabase } from "./Events/db.js"
import { ICoinPacksDatabase } from "../../types/lib/db/CoinPacks/types.js"
import { CoinPacksDatabase } from "./CoinPacks/db.js"
import { ICurrencyDatabase } from "../../types/lib/db/Currency/types.js"
import { CurrencyDatabase } from "./Currency/db.js"
import { TermsAndConditionsDatabase } from "./T&C/db.js"
import { ITermsAndConditionsDatabase } from "../../types/lib/db/termsAndConditions/types.js"
import { NotificationDatabase } from "./Notifications/db.js"


export default class DatabaseFactory{
    private static instance : DatabaseFactory | null = null
    private static instanceKey = Symbol("uniqueInstanceKey")
    private database
    private readonly AuthenticationDatabase : IAuthenticationDatabase
    private readonly GameDatabase : IGameDatabase
    private readonly GameEventDatabase : IGameEventsDatabase
    private readonly CoinPacksDatabase : ICoinPacksDatabase
    private readonly CurrencyDatabase : ICurrencyDatabase
    private readonly TermsAndConditonsDatabase : ITermsAndConditionsDatabase
    private readonly NotificationDatabase : NotificationDatabase

    //--------------------Make proper changes form continue here------------------------------------//

    constructor(instance_key : Symbol, db_configs : any, dbConnectionString : string | undefined)
    {
        if(instance_key !== DatabaseFactory.instanceKey)
        {
            throw new Error("Please use DatabaseFactory.getInstance method to create an instance")
        }
        const dbName = db_configs.db_name
        const connectionTimeoutDurationMs = db_configs.connection_timeout_ms || 12000
        const userCollectionName = db_configs.user_auth_db_collection_name || "users"
        const gamesCollectionName = db_configs.game_collection_name || "games"
        const eventCollectionName = db_configs.event_collection_name || "events"
        const currencyCollectionName = db_configs.currency_collection_name || "currency"
        const coinPacksCollectionname = db_configs.coin_collection_name || "coin_packs"
        const saltRounds = db_configs.number_of_salt_rounds || 12
        if(!dbConnectionString || !dbName)
        {
            // TODO : Use proper colours and logs to output info in logs
            throw new Error("Invalid database configs")
        }
        this.database = new Database(dbName, dbConnectionString, connectionTimeoutDurationMs)
        this.AuthenticationDatabase = new AuthenticationDatabase(this.database, userCollectionName, saltRounds)
        this.GameDatabase = new GameDatabase(this.database, gamesCollectionName)
        this.GameEventDatabase = new GameEventsDatabase(this.database, eventCollectionName)
        this.CurrencyDatabase = new CurrencyDatabase(this.database, currencyCollectionName)
        this.CoinPacksDatabase = new CoinPacksDatabase(this.database, coinPacksCollectionname)
        this.TermsAndConditonsDatabase = new TermsAndConditionsDatabase(this.database)
        this.NotificationDatabase = new NotificationDatabase(this.database)
    }    
    public static getInstance(mongoDbConnectionString : string | undefined, db_configs : any)
    {
        if(!this.instance)
        {
            this.instance = new DatabaseFactory(this.instanceKey, db_configs, mongoDbConnectionString)
        }
        return this.instance
    }
    getAuthenticationDatabase()
    {
        return this.AuthenticationDatabase
    }
    getGameDatabase()
    {
        return this.GameDatabase
    }
    getEventDatabase(){
        return this.GameEventDatabase
    }
    getCurrencyDatabase()
    {
        return this.CurrencyDatabase
    }
    getCoinPacksDatabase()
    {
        return this.CoinPacksDatabase
    }
    getTermsAndConditonsDatabase()
    {
        return this.TermsAndConditonsDatabase
    }
    getNotificationdatabase()
    {
        return this.NotificationDatabase
    }
}