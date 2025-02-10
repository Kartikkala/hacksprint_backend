import express from 'express';
import MoneyManager from '../lib/moneyManager/moneyManager.js';

// Assuming AdminMiddleware is imported correctly

export default function ShopRouter(moneyManager : MoneyManager)
{
    const router = express.Router();
    router.use(express.json()); // for parsing application/json

    router.get("/getCurrency", async (req, res)=>{
        if(req.user)
        {
            const currency = await moneyManager.getUserMoney(req.user.email)
            return res.json({totalMoney : currency.totalMoney})
        }
        return res.status(500).send("Internal Server error!")
    })

    router.get("/upi", async (req, res)=>{
        if(req.user)
        {
            const upi = await moneyManager.getUpiIdWithEmail(req.user.email)
            return res.json({
                "success" : upi !== undefined,
                "upi" : upi
            })                
        }
        return res.status(401).send("Unauthorized!")
    })

    router.post("/upi", async (req, res)=>{
        if(req.user)
        {
            if(req.body && req.body.upi)
            {
                const upi = await moneyManager.updateUpiId(req.user.email, req.body.upi)
                return res.json({
                    "success" : upi
                })
            }
            return res.status(400).send("Invalid request body!")
        }
        return res.status(401).send("Unauthorized!")
    })

    router.get("/getPacks", async (req, res)=>{
        const packs = await moneyManager.getMoneypacks()
        return res.json({
            "packs" : packs
        })
    })

    router.post('/createMoneyOrder', async (req, res)=>{
        if(req.body && req.body.packId && req.user)
        {
            const order = await moneyManager.createMoneyOrder(req.user.email, req.body.packId)
            if(order)
            {
                return res.json(order)
            }
            return res.status(500).send("Order creation failed!")
        }
        return res.status(400).send("packId parameter missing!")
    })

    router.post("/buyPack", async(req, res)=>{
        if(req.body && req.body.packId && req.user && req.body.orderId && req.body.paymentId && req.body.signature)
        {
            const result = await moneyManager.buyMoneyPack(req.user.email, req.body.packId, req.body.orderId, req.body.paymentId, req.body.signature)
            return res.json({"success" : result})
        }
        return res.status(400).send("packId/orderId/paymentId/signature parameter missing!")
    })


    router.post("/deletePack", async(req, res)=>{
        // TODO
        res.send(401).send("Do not come here!")
    })
    
    return router;
}

