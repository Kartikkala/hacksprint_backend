import { NextFunction, Request, Response } from "express";
import {  ITermsAndConditionsDatabase } from "../../types/lib/db/termsAndConditions/types";

export default class TermsAndConditions
{
    private static instance : TermsAndConditions
    private termsAndConditonsDb : ITermsAndConditionsDatabase
    constructor(termsAndConditionsDb : ITermsAndConditionsDatabase)
    {
        this.termsAndConditonsDb = termsAndConditionsDb
    }

    public async getTermsAndConditons(req : Request, res : Response, next : NextFunction)
    {
        if(req.body && req.body.version)
        {
            const termsAndConditions = await this.termsAndConditonsDb.getTermsByVersion(req.body.version);
            if(termsAndConditions)
            {
                return res.json({
                    version : termsAndConditions.version,
                    terms : termsAndConditions.terms
                })
            }
            else
            {
                res.status(403).send("Invalid terms version!")
            }
        }
        res.status(400).send("Invalid request format!")
    }

    public async signForTermsAndConditons(req  : Request, res  : Response, next  : NextFunction)
    {
        if(req.body && req.body.email && req.body.version)
        {
            const result = await this.termsAndConditonsDb.signUserForTerms(req.body.version, req.body.email)
            if(result)
            {
                next()
            }
            else{
                return res.status(500).send("Internal server error")
            }
        }
        return res.status(400).send("Invalid request format");
    }
}