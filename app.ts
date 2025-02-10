import express from "express";
import cors from 'cors'
import { appConfig } from "./configs/config.js";
import {config} from 'dotenv'
import {fileURLToPath} from 'url'
import path,{dirname} from 'path'

import AdminRouter from "./routes/adminRoutes.js";
import getAuthenticationRouter from "./routes/authenticationRoutes.js";

import GameAndEventsManagerFactory from "./lib/GamesAndEvents/index.js"
import AuthenticationFactory from "./lib/authentication/authenticator.js";
import DatabaseFactory from "./lib/db/database.js";
import AuthorisationMiddlewareFactory from "./lib/authorisation/index.js";
import EventRegistrationRouter from "./routes/eventRegistrationRoutes.js";
import ShopRouter from "./routes/shopRoutes.js";
import MoneyManager from "./lib/moneyManager/moneyManager.js";
import Razorpay from 'razorpay'
import TermsAndConditions from "./lib/T&C/T&C.js";
import NotificationRouter from "./routes/notificationRoutes.js";
import NotificationManager from "./lib/notifications/notificationManager.js";

const app = express();
const rzp = new Razorpay({key_id : "something", key_secret : "somethingelse"}) // Change this
config({path : ".env"})


app.use(express.json({limit : "4mb"}))
app.use(express.urlencoded({extended : true, limit : "4mb"}))
app.use(cors({origin : appConfig.frontendUrl,credentials : true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization']}))

const dbConnectionString = process.env.MONGO_CONNECTION_STRING
const senderEmailPassword = process.env.USER_EMAIL_PASSWORD

const databaseFactory = DatabaseFactory.getInstance(dbConnectionString, {
    "db_name" : appConfig.dbName,
}); // Import appConfigs from a file


const authenticationFactory = AuthenticationFactory.getInstance(databaseFactory.getAuthenticationDatabase(), {"keypair_directory" : "keys", "publickey_filename" : "key.pub", "privatekey_filename" : "key.pem"})
const authorizationFactory = await AuthorisationMiddlewareFactory.getInstance(appConfig.smtpServiceName, appConfig.smtpServerAddress, appConfig.smtpServerPortNumber, false, appConfig.smtpServerEmail, senderEmailPassword, appConfig.smtpServerSenderName, appConfig.smtpOtpLength)
const gamesAndEventManagerFactoryObject = await GameAndEventsManagerFactory.getInstance(databaseFactory.getEventDatabase(), databaseFactory.getGameDatabase())

const moneyManagerObject = MoneyManager.getInstance(databaseFactory.getCurrencyDatabase(), databaseFactory.getCoinPacksDatabase(), rzp, "something")
const termsAndConditions = new TermsAndConditions(databaseFactory.getTermsAndConditonsDatabase())


const authenticationRouter = getAuthenticationRouter(authenticationFactory, authorizationFactory, termsAndConditions)
const eventRegistrationRouter = EventRegistrationRouter(gamesAndEventManagerFactoryObject, moneyManagerObject)
const notificationRouter = NotificationRouter(new NotificationManager(databaseFactory.getNotificationdatabase()))

const shopRouter = ShopRouter(moneyManagerObject)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const frontend= path.join(__dirname, "/dist")
app.use("/",  express.static(frontend))
app.get("/", (req, res)=>{
    res.redirect("/api/login")
})

app.get('/api/user', authenticationFactory.jwtAuthenticator.authenticate, authenticationFactory.jwtAuthenticator.isAuthenticated, (req, res)=>{
    if(req.user)
    {
        const user = {
            name : req.user.name,
            admin : req.user.admin,
            email : req.user.email,
            success : true,
        }
        return res.json(user)
    }
    else
    {
        return res.status(401).json({success : false})
    }
})
app.use("/api/", authenticationRouter)
app.use("/api/admin", authenticationFactory.jwtAuthenticator.authenticate, authenticationFactory.jwtAuthenticator.isAuthenticated, AdminRouter(gamesAndEventManagerFactoryObject, moneyManagerObject))
app.use("/api/events", authenticationFactory.jwtAuthenticator.authenticate, authenticationFactory.jwtAuthenticator.isAuthenticated ,eventRegistrationRouter)
app.use("/api/shop",authenticationFactory.jwtAuthenticator.authenticate,  authenticationFactory.jwtAuthenticator.isAuthenticated ,shopRouter)
app.use("/api/notifications", authenticationFactory.jwtAuthenticator.authenticate, authenticationFactory.jwtAuthenticator.isAuthenticated, notificationRouter)


app.listen(80 , "0.0.0.0" ,()=>{
    console.log("Listening on port 80...")
})
