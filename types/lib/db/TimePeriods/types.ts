export interface ITimePeriodDocument{
    timePeriodId : {
        type : string,
        required : true,
        unique : true,
        index : true
    },
    name : String
}