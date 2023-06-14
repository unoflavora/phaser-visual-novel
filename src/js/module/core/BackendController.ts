import { AuthData, InitData, Response } from "Definitions/BackendResponse";
import IGameData from "./GameData";

export default class BackendController 
{
    private _token : string | null = "";
    public tokenExpiredDate: string | null = "";

    public set token(value: string | null) 
    {
        this._token = value;
    }

    public get token() { return this._token };

    public async Login(email : string, password : string) : Promise<Response<AuthData>>
    {
        return fetch(CONFIG.BASE_URL + "/auth/login", {
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
        if(this._token == null) {
            console.error("Token is null");
            return Promise.reject("Token is null");
        }

        return fetch(CONFIG.BASE_URL + "/game/init", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this._token,
            },
            body: JSON.stringify({})
        }).then(res => res.json());
    }

    public async SaveGame(data : IGameData) : Promise<Response<boolean>>
    {
        return fetch(CONFIG.BASE_URL + "/game/save-game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this._token,
            },
            body: JSON.stringify({
                sessionId: data.sessionId,
                gameMetaData: JSON.stringify(data)
            })
        }).then(res => res.json());
    }

}