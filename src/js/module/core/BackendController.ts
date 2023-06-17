import { AuthData, InitData, Response } from "Definitions/BackendResponse";
import { SubmitScoreData } from "Definitions/GameScore";
import { IGameData } from "Definitions/Settings";

export default class BackendController 
{
    public token : string | null = "";
    public tokenExpiredDate: string | null = "";
    public sessionId: string | null = "";

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
        if(this.token == null) {
            console.error("Token is null");
            return Promise.reject("Token is null");
        }

        return fetch(CONFIG.BASE_URL + "/game/init", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token,
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
                "Authorization": "Bearer " + this.token,
            },
            body: JSON.stringify({
                sessionId: data.sessionId,
                gameMetaData: JSON.stringify(data)
            })
        }).then(res => res.json());
    }

    public async SubmitScore(scoreData: SubmitScoreData) : Promise<Response<boolean>>
    {
        var payload = {
            sessionId: this.sessionId,
            scoreData: scoreData
        }

        console.log(payload)
        return fetch(CONFIG.BASE_URL + "/game/submit-score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token,
            },
            body: JSON.stringify(payload)
        }).then(res => res.json()).catch(err => {
            console.error(err);
            return Promise.reject(err);
        });

    }

}