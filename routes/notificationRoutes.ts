import express from 'express';
import NotificationManager from '../lib/notifications/notificationManager.js';

export default function NotificationRouter(notificationManager : NotificationManager)
{
    const router = express.Router();
    router.use(express.json()); // for parsing application/json


    router.get("/getAll", async (req, res)=>{
        if(req.user)
        {
            const notifications = await notificationManager.getAllNotifications()
            return res.json(notifications)
        }
        return res.status(401).send("Unauthroized!")
    })

    router.post("/createNotification", async (req, res)=>{
        if(req.user && req.user.admin)
        {
            if(req.body && req.body.title && req.body.description)
            {
                const result = await notificationManager.createNotification(req.body.title, req.body.description)
                if(result)
                {
                    return res.json({"success" : true})
                }
                else
                {
                    return res.json({"success" : false})
                }
            }
            return res.status(400).send("Bad request body")
        }
        return res.status(401).send("Unauthorized!")
    })

    router.post("/deleteNotification", async (req, res)=>{
        if(req.user && req.user.admin)
        {
            if(req.body && req.body.id)
            {
                const result = await notificationManager.deleteNotification(req.body.id)
                if(result)
                {
                    return res.json({"success" : true})
                }
                else{
                    return res.json({"success" : false})
                }
            }
            return res.status(400).send("Bad request body")
        }
        return res.status(401).send("Unauthroized!")
    })
    
    return router;
}

