import { AuthData, InitData, Response } from "Definitions/BackendResponse";

export default class BackendController 
{
    private _token : string | null = "";

    public set token(value: string | null) 
    {
        this._token = value;
    }

    public async Login(email : string, password : string) : Promise<Response<AuthData>>
    {
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

    public async Init() : Promise<Response<InitData>>
    {
        if(this._token == null) return Promise.reject("Token is null");

        return fetch(CONFIG.GAME_URL + "/game/init", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this._token,
            },
            body: JSON.stringify({})
        }).then(res => res.json());
    }

}