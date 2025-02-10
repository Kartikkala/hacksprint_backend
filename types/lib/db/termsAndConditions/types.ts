// types/lib/db/termsAndConditions/types.ts
export interface ITermsAndConditionsDocument {
    userEmail: string;
    signedAt: Date;
    version: string;
}

export interface ITermsAndConditionsByVersion
{
    version : string,
    terms : string
}

export interface ITermsAndConditionsDatabase {
    getTermsByVersion(version: string): Promise<ITermsAndConditionsByVersion | null>;
    signUserForTerms(version : string, email : string) : Promise<boolean>
}