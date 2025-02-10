import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { OTPObject, IOtpGenerationResult } from '../../types/lib/authorisation/types.js'

export default class Authorisation{
    private _transporter : nodemailer.Transporter | undefined
    private static _instance : Authorisation | undefined = undefined
    private _senderEmail : string | undefined
    private _emailToOtpMap : Map<string, OTPObject> = new Map<string, OTPObject>
    private constructor(serviceName? : string, serviceHostAddress? : string, servicePortNumber? : number, secure? : boolean, email? : string, password? : string)
    {
        this.setTransporter(serviceName, serviceHostAddress, servicePortNumber, secure, email, password)
    }
    public static async getInstance(serviceName? : string, serviceHostAddress? : string, servicePortNumber? : number, secure? : boolean, email? : string, password? : string, testEmail? : string)
    {
        if(!this._instance)
        {
            this._instance = new Authorisation(serviceName, serviceHostAddress, servicePortNumber, secure, email, password)
            try{
                if(this._instance && this._instance._transporter)
                {
                        await this._instance._transporter.sendMail({
                        from : {
                            name : "Esports Website Test",
                            address : this._instance._senderEmail || "kartikkala10december@gmail.com"
                        },
                        to : testEmail,
                        subject : "Testing mail service for Esports Website",
                        html : `Test was successful! Website is up!`,
                    })
                    return this._instance
                }
            }
            catch(e)
            {
                console.error(e)
                process.exit(-1)
            }
        }
    }
    public setTransporter(serviceName? : string, serviceHostAddress? : string, servicePortNumber? : number, secure? : boolean, email? : string, password? : string) : boolean{
        if(serviceName && serviceHostAddress && typeof secure === 'boolean' && email && password && servicePortNumber)
        {
            this._transporter = nodemailer.createTransport({
                name : serviceName,
                host : serviceHostAddress,
                port : servicePortNumber,
                secure : secure,
                auth : {
                    user : email,
                    pass : password
                },
                connectionTimeout : 10000,
                dnsTimeout : 10000,
                socketTimeout : 10000,
                greetingTimeout : 10000
            })
            this._senderEmail = email
            return true
        }
        return false
    }

    public async generateAndSendOtp(recipientEmail : string, senderName :string, otpLength : number, maxTries : number = 5, minRetryDuration : number = 1000*60) : Promise<IOtpGenerationResult>
    {
        // TODO : Make this function DRY ( change if(exisitingUser) to if(!existingUser))
        const existingUser = this._emailToOtpMap.get(recipientEmail)
        const result : IOtpGenerationResult= {
            success : false,
            error : false,
            minTimeToWait : undefined,
            triesLeft : existingUser ? maxTries - existingUser.tries: maxTries-1
        }
        if(this._transporter && this._senderEmail)
        {
            try{
                if(existingUser) // TODO : Talking about this
                {
                    let nextRetryTime = (existingUser.lastRetry + (minRetryDuration * existingUser.tries))
                    
                    if(existingUser.tries < maxTries && nextRetryTime < Date.now())
                    {
                        this._transporter.sendMail({
                            from : {
                                name : senderName,
                                address : this._senderEmail
                            },
                            to : recipientEmail,
                            subject : "OTP for Esports Website",
                            html : `Your otp for esports Website is : <b>${existingUser.otp}</b>. This otp is valid for 10 minutes!`,
                        })
                        result.success = true
                        result.triesLeft-= existingUser.tries
                        existingUser.lastRetry = Date.now()
                        existingUser.tries++

                        // Recalculate nextRetryTime with newer lastRetry time
                        nextRetryTime = (existingUser.lastRetry + (minRetryDuration * existingUser.tries))
                    }
                    result.minTimeToWait = nextRetryTime - Date.now()
                }
                else{
                    // Generate a new otp
                    const otp = await new Promise<string>((resolve, reject)=>{
                        crypto.randomBytes(otpLength, (e, buff)=>{
                            if(e)
                            {
                                return reject(e)
                            }
                            resolve(buff.toString('hex'))
                        })
                    })
                    this._transporter.sendMail({
                        from : {
                            name : senderName,
                            address : this._senderEmail
                        },
                        to : recipientEmail,
                        subject : "OTP for Personal Cloud Drive",
                        html : `Your otp for cloud drive is : <b>${otp}</b>. This otp is valid for 10 minutes!`
                    }, (e)=>{
                        if(e)
                        {
                            console.error(e)
                            result.success = false
                            result.error = true
                        }
                    })
                    const userOtpObject : OTPObject = {
                        tries : 1,
                        issuedAt : Date.now(),
                        lastRetry : Date.now(),
                        otp : otp
                    }
                    result.minTimeToWait = minRetryDuration
                    result.success = true
                    this._emailToOtpMap.set(recipientEmail, userOtpObject)
                }
            }
            catch(e)
            {
                console.error(e)
                result.error = true
            }
        }
        else{
            result.error = true
        }
        return result
    }

    public verifyOtp(recipientEmail : string, inputOtp : string, maxOtpExpiryDurationSeconds : number = 1000*60*10) : boolean
    {
        const user = this._emailToOtpMap.get(recipientEmail)
        if(user && user.issuedAt + maxOtpExpiryDurationSeconds > Date.now() && user.otp === inputOtp)
        {
            this._emailToOtpMap.delete(recipientEmail)
            return true
        }
        return false
    }
}
