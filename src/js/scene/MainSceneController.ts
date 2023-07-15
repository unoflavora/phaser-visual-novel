import { SceneInfo } from "Definitions/SceneInfo";
import PopupController, { PopupType } from "./popup/PopupController";
import AudioController from "Modules/core/AudioController";
import BackendController from "Modules/core/BackendController";
import { AuthData, InitData, Response } from "Definitions/BackendResponse";
import ProgressController from "Modules/core/ProgressController";
import Settings from "Modules/core/SettingsController";
import { IGameData, LanguageEnum } from "Definitions/Settings";
import ScoreController from "Modules/scoring/ScoreController";
import GameScore, { SubmitScoreData } from "Definitions/GameScore";
import { MinigameTypes } from "Definitions/Minigame";
import Localizations from "Modules/localization/LocalizationHelper";
import ConsoleHelper from "Modules/helpers/ConsoleHelper";
export default class MainSceneController extends Phaser.Scene {    
    private audio! : AudioController;

    private _popupController!: PopupController;

    private _backendController! : BackendController;

    private _settings! : Settings;

    private _progressController! : ProgressController;

    private _initData!: InitData;

    private _scoringController!: ScoreController;
   
    private static _instance : MainSceneController;

    public get backend() { return this._backendController; }

    public get settings() { return this._settings };

    public get progress() { return this._progressController };

    public get initData() { return this._initData; }


    public gameData : IGameData = {
        sessionId: "",
        settings: {
            lang: LanguageEnum.English,
            isSfxOn: true,
            isBgmOn: true
        },
        progress: {
            playedMinigames: [],
            emotionalUnderstanding: {
                currentSceneState: 0,
                currentSceneIndex: -1,
                userResponses: [],
                userEmotions: [],
                scores: {
                    emotion : 0,
                    response: 0
                }
            }
        },
        results: null
    }
    

    static get instance()
    {
        if (!this._instance) throw Error('Main is not initialized');

        return this._instance;
    };

    constructor() {
        
        super({ key: SceneInfo.mainScene.key });

        ConsoleHelper.Log("Main Scene Constructor")

        MainSceneController._instance = this;

    }    
    
    async init(finishLoading: Function)
    {
        this.InitModules();

        window.addEventListener('offline', () => {            
            this.OpenTemplatePopup(PopupType.LostConnection);
        });

        window.addEventListener('online', () => {            
            this._popupController.closeLostConnectionPopup();            
        });

        if(navigator.onLine == false) {
            this.OpenTemplatePopup(PopupType.LostConnection);

            await new Promise<void>(resolve => {
                window.addEventListener('online', () => {
                    resolve();
                });
            })
        }

        this._backendController.token = localStorage.getItem("token");

        this._backendController.tokenExpiredDate = localStorage.getItem("tokenExpiredDate");

        await this.gameInit();

        finishLoading();

        this.startGame();
    }     
    

    private InitModules() {
        console.log("ENVIRONMENT : " + CONFIG.ENVIRONMENT);

        this.audio = AudioController.instance;

        this.audio.init(this, false);

        this._popupController = new PopupController(this);

        this._backendController = new BackendController();

        this._progressController = new ProgressController();

        this._settings = new Settings();

        this._popupController.registerOnClosePopup(() => this.ClosePopup());

        this._scoringController = new ScoreController();

        this.gameData.results = this._scoringController.scores;
    }

    async startGame() { 
        ConsoleHelper.Log("Starting Game...")      
        this.scene.launch(SceneInfo.languageSelectorScene.key);        
    }

    public async Login(username : string, password : string, rememberUser: boolean) : Promise<Response<AuthData> | null>
    {
        try 
        {
            var auth = await this.backend.Login(username, password);

            if (auth.error == null)
            {
                if(rememberUser)
                {
                    localStorage.setItem("token", auth.data.token);

                    localStorage.setItem("tokenExpiredDate", auth.data.tokenExpiredDate.toString());    
                }

                this.backend.token = auth.data.token;

                this.backend.tokenExpiredDate = auth.data.tokenExpiredDate;

                await this.gameInit();
            }

            return auth;
        } catch(e)
        {
            ConsoleHelper.Log(e)
            if (e instanceof Error)
            {
                this.OpenTemplatePopup(PopupType.Error, e.message);
            }

            return null;
        }
    }

    private async gameInit() 
    {
        ConsoleHelper.Log(this._backendController.token, this.backend.tokenExpiredDate)

        if (this._backendController.token != null && this.backend.tokenExpiredDate != null)
        {
            var expiredDate = new Date(this.backend.tokenExpiredDate);

            var now = new Date();

            ConsoleHelper.Log(expiredDate, now)

            if(expiredDate < now)
            {
                ConsoleHelper.Log("Expired")
                this._backendController.token = null;
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiredDate");
                return;
            }

            try 
            {
                var initData = await this._backendController.Init();

                if(initData.error != null) throw new Error(initData.error.message)
                this._initData = initData.data;
                this._backendController.sessionId = initData.data.sessionId;

                ConsoleHelper.Log("INIT DATA", this._initData)

                if(initData.data.savedData != null && initData.data.savedData != "")
                {
                    var data = JSON.parse(initData.data.savedData);
                    this.gameData = {...this.gameData, ...data};

                    if(this.gameData.progress.emotionalUnderstanding.userResponses == null)
                    {
                        this.gameData.progress.emotionalUnderstanding.userResponses = [];
                    }

                }

                this.gameData.sessionId = initData.data.sessionId;

                this.gameData.results = this._scoringController.Init(this.gameData.results!, this.gameData.progress.emotionalUnderstanding.scores)

                ConsoleHelper.Log("GAME DATA", this.gameData)
        
            } catch(e)
            {
                ConsoleHelper.Log(e)
                if (e instanceof Error)
                {
                    this.OpenTemplatePopup(PopupType.Error, e.message);
                }

                return null;
            }
        }       
    }

    public Logout()
    {
        try {

            localStorage.removeItem("token");
            this.backend.token = null;

            localStorage.removeItem("tokenExpiredDate");    
            this.backend.tokenExpiredDate = null;

            var scenes = this.scene.manager.getScenes();
    
            var loadedScene = scenes.filter(scene => scene.scene.key != SceneInfo.mainScene.key && scene.scene.key != SceneInfo.debugScene.key)
    
            // remove the currently loaded scene
            loadedScene.forEach(scene => this.scene.stop(scene.scene.key))
    
            AudioController.instance.stopBGM();
            // load the login scene
            this.scene.launch(SceneInfo.loginScene.key);
    
        }
        catch(e)
        {
            if (e instanceof Error)
            {
                this.OpenTemplatePopup(PopupType.Error, e.message);
            }
        }

    }

    public OpenTemplatePopup(type : PopupType, message: string = "")
    {
        this.scene.bringToTop();

        this.HideAllDOMElements();

        this._popupController.OpenPopup(type, message);
    }


    private ClosePopup()
    {
        ConsoleHelper.Log("Closing Popup")

        this.HideAllDOMElements(false)

        this.scene.sendToBack();
    }

    public async SaveGameData()
    {  
        try {
            var res = await this._backendController.SaveGame(this.gameData);
            if(res.error != null)
            {
                throw Error(res.error.message);
            }
            ConsoleHelper.Log("progress saved")
        } catch(e)
        {
            ConsoleHelper.Log(e)
            if (e instanceof Error)
            {
                this.OpenTemplatePopup(PopupType.Error, Localizations.text.errors.failed_to_save.desc );
            }
        }

    }

    public OpenInfoPopup(title: string, message: string | string[], iconKey: string, onConfirm : Function, onConfirmText: string, onCancel : Function | null = null, onCancelText: string | null = null)
    {
        this.scene.bringToTop();

        this.HideAllDOMElements();

        this._popupController.openInfoPopup(title, message, iconKey, () => this.ClosePopup(), onConfirmText, onCancel, onCancelText);
    }

    private HideAllDOMElements(hide : boolean = true) {
        var domElements = document.getElementsByClassName("phaser-dom-elements");

        for (var i = 0; i < domElements.length; i++) {
            var element = domElements[i] as HTMLElement;

            if(hide) element.classList.add("hidden");
            
            else element.classList.remove("hidden");
        }
    }

    public AddEmotionScore(emotion: number)
    {
        this.gameData.progress.emotionalUnderstanding.scores.emotion = this._scoringController.addEmotionalScore(emotion)
    }

    public AddRespondScore(respond: number)
    {
        this.gameData.progress.emotionalUnderstanding.scores.response = this._scoringController.addRespondScore(respond)
    }

    public AddMinigameScore(minigameType: MinigameTypes, minigameScore : GameScore)
    {
        this.gameData.results = this._scoringController.addMinigameScore(minigameType, minigameScore)
    }

    public async FinishMinigames()
    {
        var finalScore = this._scoringController.getFinalScore();

        await this.SaveGameData();

        this.gameData.results = finalScore;
        ConsoleHelper.Log(this.gameData.results)

        var scoreData : SubmitScoreData = {
            wM_Accuracy: finalScore[MinigameTypes.MemoryOfSpades].accuracy,
            wM_Performance: finalScore[MinigameTypes.MemoryOfSpades].performance,
            sR_Accuracy: finalScore[MinigameTypes.PuzzleBlock].accuracy,
            sR_Performance: finalScore[MinigameTypes.PuzzleBlock].performance,
            lC_Accuracy: finalScore[MinigameTypes.GuessTheWord].accuracy,
            lC_Performance: finalScore[MinigameTypes.GuessTheWord].performance,
            nR_Accuracy: 0,
            nR_Performance: 0,
            lR_Accuracy: 0,
            lR_Performance: 0,
            pS_Accuracy: 0,
            pS_Performance: 0,
            aP_Accuracy: 0,
            aP_Performance: 0,
            eU_Accuracy: finalScore[MinigameTypes.EmotionalUnderstanding].accuracy,
            eU_Performance: finalScore[MinigameTypes.EmotionalUnderstanding].performance,
        }

        ConsoleHelper.Log("Final score data", scoreData)


        try {
            var res = await this._backendController.SubmitScore(scoreData);
            ConsoleHelper.Log(res)
            if(res.error != null)
            {
                throw new Error(res.error.message);
            }
            this.initData.hasPlayed = true;
            this.scene.stop(SceneInfo.gameplayScene.key)
            this.scene.launch(SceneInfo.completedScene.key);
        } catch(e)
        {
            ConsoleHelper.Log(e)
            if (e instanceof Error)
            {
                this.OpenTemplatePopup(PopupType.Error, e.message);
            }
        }
    }
}