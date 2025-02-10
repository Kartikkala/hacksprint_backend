// time period documentation
export interface ITimePeriodEventDocument {
    eventId: String;   // MongoDB Object ID for the GameEvent document
    eventDateTime : string,
    users: Map<string, string[]>;          // The list of user ids participating in this event
    timePeriodId: String;   // Reference to a Time period document, not collection name
    eventVenue : String,
    fee : number,
}


