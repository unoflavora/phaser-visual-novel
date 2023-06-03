import { AuthResponse } from "Definitions/BackendResponse";

export default class BackendController 
{
    public async Login(email : string, password : string) : Promise<AuthResponse>
    {
        const body = JSON.stringify({email, password});
        console.log(body)
        return fetch(CONFIG.GAME_URL + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // cors
                "Access-Control-Allow-Origin": "*",
                
            },
            body: JSON.stringify({email, password})
        }).then(res => res.json());
    }

}