import express from 'express'
import AuthenticationFactory from '../lib/authentication/authenticator.js'
import AuthorisationMiddlewareFactory from '../lib/authorisation/index.js'
import { IRegistrationResult } from '../types/lib/authentication/helper/types.js'
import TermsAndConditions from '../lib/T&C/T&C.js'

export default function getAuthenticationRouter(authenticationFactory : AuthenticationFactory, authorization : AuthorisationMiddlewareFactory, termsAndCondtions : TermsAndConditions)
{
    const authenticationRouter = express.Router()
    const jwtAuthenticator = authenticationFactory.jwtAuthenticator
    authenticationRouter.post('/otp', authorization.generateAndSendRegistrationOtpMiddleware)
    authenticationRouter.post('/login', jwtAuthenticator.login)
    authenticationRouter.post('/register', authorization.verifyOtpMiddleware , termsAndCondtions.signForTermsAndConditons, jwtAuthenticator.register, (request, response)=>{
        const registrationResult : IRegistrationResult = response.locals.registrationResult
        
        registrationResult.user = undefined
        console.log(registrationResult)
        switch (registrationResult.message){
            case 'UserCreationSuccessful':
                return response.status(200).send(registrationResult)
            case 'UserAlreadyExists':
                return response.status(400).send(registrationResult)
            default:
                return response.status(500).send(registrationResult)
        }
    })
    return authenticationRouter
}

