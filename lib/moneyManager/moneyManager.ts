import Razorpay from 'razorpay'
import { ICurrencyDatabase } from "../../types/lib/db/Currency/types.js";
import { ICoinPacksDatabase } from "../../types/lib/db/CoinPacks/types.js";
import crypto from 'crypto'


export default class MoneyManager{
    private currencyDb : ICurrencyDatabase;
    private coinPacksDb : ICoinPacksDatabase;
    private rzpSecret : string
    private rzp : Razorpay;
    private static _instance : MoneyManager
    private constructor(currencyDatabase : ICurrencyDatabase, coinPacksDatabase : ICoinPacksDatabase, razorPay : Razorpay, rzpSecret : string){
        this.currencyDb = currencyDatabase;
        this.coinPacksDb = coinPacksDatabase;
        this.rzpSecret = rzpSecret
        this.rzp = razorPay;
    }

    public static getInstance(currencyDatabase : ICurrencyDatabase, coinPacksDatabase : ICoinPacksDatabase, razorPay : Razorpay, rzpSecret : string) // Use users database only to store thier available money, razorpay for payment handling
    {
        if (!this._instance) {
          this._instance = new MoneyManager(currencyDatabase, coinPacksDatabase, razorPay, rzpSecret);
        }
        return this._instance;
    }


    public async getUserMoney(email : string) {
        let currency = await this.currencyDb.getTotalUserCurrencyById(email);
        if(!currency){
            throw new Error("No Currency Found");
        }
        return currency;
    }

    public async createMoneyOrder(email: string, moneyPackId : string)
    {
        const packs = await this.coinPacksDb.getCoinPacks()
        for(let i=0;i<packs.length;i++)
        {
            const pack = packs[i]
            if(pack._id.toString() === moneyPackId)
            {
                const options = {
                    amount : pack.price * 100,
                    currency : "INR",
                    receipt : crypto.randomUUID() 
                }
                try{
                    // Razorpay order creation
                    const order = await this.rzp.orders.create(options)
                    return order
                }
                catch(e)
                {
                    console.error(e)
                }
            }
        }
        return false
    }

    public async buyMoneyPack(email : string, moneyPackId : string, orderId : string, paymentId : string, signature : string)
    {
        const packs = await this.coinPacksDb.getCoinPacks()
        for(let i=0;i<packs.length;i++)
        {
            const pack = packs[i]
            if(pack._id.toString() === moneyPackId)
            {
                try{
                    // Razorpay verify payment
                    const hmac = crypto.createHmac("sha256", this.rzpSecret)
                    hmac.update(orderId + "|" + paymentId)
                    const generatedSignature = hmac.digest("hex")
                    if(generatedSignature === signature)
                    {
                        return await this.currencyDb.addCurrencyWithId(pack.coins, email)
                    }
                }
                catch(e)
                {

                }

                // ------------------- Use razorpay here ----------------------- //
            }
        }
        return false
    }

    public async updateUpiId(email : string, upiId : string)
    {
        return await this.currencyDb.updateUpiId(email, upiId)
        // What the hell is the admin supposed to do with this. Add the winner's In game ID as well, that can be used to search this upi ID while declaring the winner.
    }

    public async getUpiIdWithEmail(email : string)
    {
        return (await this.currencyDb.getTotalUserCurrencyById(email))?.upiId
    }

    public async createMoneyPack(coins : number, price : number)
    {
        return await this.coinPacksDb.createCoinPack(coins, price)
    }

    public async getMoneypacks()
    {
        return await this.coinPacksDb.getCoinPacks()
    }

    public async deleteMoneyPack(id : string)
    {
        return await this.coinPacksDb.deleteCoinPack(id)
    }

    public async deductMoney(email : string, amount : number)
    {
        return await this.currencyDb.deductFromUserAccountByID(amount, email)
    }

    public async addMoney(email : string, amount : number)
    {
        return await this.currencyDb.addCurrencyWithId(amount, email)
    }

    public async modifyMoneyPack(id : string, newCoinsAmount : number, newPrice : number)
    {
        return await this.coinPacksDb.updateCoinPack(id, newCoinsAmount, newPrice)
    }
}