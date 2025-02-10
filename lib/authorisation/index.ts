import Authorisation from "./authorisation.js"
import { Request, Response, NextFunction } from "express"

export default class AuthorisationMiddlewareFactory{
    private _authorizer : undefined | Authorisation
    private otpLength : number
    private senderName : string
    private static instanceKey = Symbol('UniqueAuthorisationInstanceKey')
    private static instance : AuthorisationMiddlewareFactory | undefined
    constructor(instanceKey : Symbol, senderName?: string, otpLength? : number)
    {
        if(!(instanceKey === AuthorisationMiddlewareFactory.instanceKey))
        {
            throw new Error("Please use AuthorisationMiddlewareFactory.getInstance() to get an instance of this class")
        }
        
        this.otpLength = otpLength || 3
        this.senderName = senderName || 'Esports Website'
        this.generateAndSendRegistrationOtpMiddleware = this.generateAndSendRegistrationOtpMiddleware.bind(this)
        this.verifyOtpMiddleware = this.verifyOtpMiddleware.bind(this)
    }
    public static async getInstance(serviceName : string, serviceHostAddress : string, servicePortNumber : number, secure : boolean, email? : string, password? : string, senderName? : string, otpLength? : number)
    {
        if(!this.instance)
        {
            this.instance = new AuthorisationMiddlewareFactory(this.instanceKey, senderName, otpLength)
            this.instance._authorizer = await Authorisation.getInstance(serviceName, serviceHostAddress, servicePortNumber, secure, email, password, "kartikkala10december@gmail.com")
        }
        return this.instance
    }

    public async generateAndSendRegistrationOtpMiddleware(request : Request, response : Response, next : NextFunction)
    {
        if(!request.body.email)
        {
            return response.status(400).json({message : "Email is required"})
        }
        if(this._authorizer)
        {
            const result = await this._authorizer.generateAndSendOtp(request.body.email, this.senderName, this.otpLength)
            return response.status(200).json(result)
        }
        return response.status(500).send("Internal server error!")
    }   

    public async verifyOtpMiddleware(request : Request, response : Response, next : NextFunction)
    {
        if(!request.body.email || !request.body.otp)
        {
            return response.status(400).json({message : "Email and OTP are required!"})
        }
        if(this._authorizer && this._authorizer.verifyOtp(request.body.email, request.body.otp))
        {
            return next()
        }
        return response.status(401).json({message : "Invalid OTP"})
    }
}