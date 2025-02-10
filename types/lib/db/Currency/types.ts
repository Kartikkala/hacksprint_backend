export interface ICurrencyDocument{
    emailId : string,
    totalMoney : number,
    upiId? : string,
    accountNumber? : string
}

export interface ICurrencyDatabase{
    updateUpiId(emailId : string, upiId? : string) : Promise<boolean | null>
    addCurrencyWithId(amount : number, userEmail : string): Promise<ICurrencyDocument | undefined>,
    deductFromUserAccountByID (amount : number , userEmail : string):Promise <ICurrencyDocument | null>,
    getTotalUserCurrencyById(userEmail :string ) : Promise<ICurrencyDocument | null>,
}