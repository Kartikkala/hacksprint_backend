import { Types } from "mongoose"
export interface IUserCurrency {  // Maybe use userdatabase only to store thier available money
    email : Types.ObjectId,
    currency : number
}