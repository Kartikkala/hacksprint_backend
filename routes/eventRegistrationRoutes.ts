import express from 'express';
import { IGameAndEventsManagerFactory } from '../types/lib/gamesManagement/game.js';
import MoneyManager from '../lib/moneyManager/moneyManager.js';
// Assuming AdminMiddleware is imported correctly

export default function EventRegistrationRouter(gameAndEventsManagerFactory : IGameAndEventsManagerFactory, moneyManager : MoneyManager)
{
    const router = express.Router();
    router.use(express.json()); // for parsing application/json

    function sanitize(STRING : string)
    {
      return STRING.replace(/\./g, '');
    }


    router.get("/events", (req, res)=>{
        if(req.user)
        {
            const events = gameAndEventsManagerFactory.getAllEvents()
            const ongoingEvents = []
            const upcomingEvents = []
            const registeredEvents = []
            for(let i = 0;i<events.length;i++)
            {
                const selectedEvent = events[i]
                const shortenedEvent = {
                    "eventId" : selectedEvent.eventId,
                    "joinId" : selectedEvent.roomId,
                    "game" : selectedEvent.game,
                    "prizepool" : selectedEvent.prizepool,
                    "fee" : selectedEvent.fee , 
                    "eventDateTime" : selectedEvent.eventDateTime,
                    "totalPlayersRegistered" : selectedEvent.players.size
                }
                if(selectedEvent.eventStatus)
                {
                    ongoingEvents.push(shortenedEvent)
                }
                else
                {
                    upcomingEvents.push(shortenedEvent)
                    selectedEvent.players.has(sanitize(req.user.email)) ? registeredEvents.push(shortenedEvent) : null
                }
            }
            res.json({
                "ongoing" : ongoingEvents,
                "upcoming" : upcomingEvents,
                "registered" : registeredEvents
            })
        }
    })

    router.post("/registerForEvent", async (req, res)=>{

        // --------------------------------------------------------------If user is already registered, why register him/her again and again--------------------------------------------------------------------------------------------------------------
        // Use inbuilt money class
        if(req.user && req.body && req.body.eventId && req.body.inGameId)
        {
            const event = gameAndEventsManagerFactory.getEvent(req.body.eventId)
            if(event)
                {
                    try{
                        const oldMoney = (await moneyManager.getUserMoney(req.user.email)).totalMoney
                        if(oldMoney < event.fee)
                        {
                            return res.status(401).send("Insufficient Balance!")
                        }
                            
                        const newMoney = (await moneyManager.deductMoney(req.user.email, event.fee))?.totalMoney
                        const eventRegistrationResult = await gameAndEventsManagerFactory.registerPlayerForEvent(req.body.eventId, req.body.inGameId ,req.user.email)

                        //--------------------------------- Replace with mongodb transactions ---------------------------------//

                        if(!eventRegistrationResult)
                        {
                            await moneyManager.addMoney(req.user.email, event.fee)
                            return res.json(
                                {
                                    success : false,
                                    newMoney : oldMoney
                                }
                            )
                        }
                        
                    return res.json({
                        success : (oldMoney != newMoney),
                        newMoney : newMoney
                    })
                }
                catch(e : any)
                {
                    return res.status(401).send("No wallet recharge!")
                }
            }
            else{
                return res.status(500).send("No such event!")
            }
        }

        res.status(400).send("eventId not found!")
    })
    
    return router;
}

