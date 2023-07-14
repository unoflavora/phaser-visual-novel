export default class ConsoleHelper
{
    static Log(message?: any, ...optionalParams : any[]) 
    {
        if(CONFIG.ENVIRONMENT == "DEV" || CONFIG.ENVIRONMENT == "STAGING")
        {
            console.log(message, optionalParams)
        }
    }
}