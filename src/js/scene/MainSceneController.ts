import { SceneInfo } from "Definitions/SceneInfo";
import PopupController, { PopupType } from "./popup/PopupController";
import AudioController from "Modules/core/AudioController";
import BackendController from "Modules/core/BackendController";
import { AuthData, InitData, Response } from "Definitions/BackendResponse";
import IGameData from "Modules/core/GameData";
import ProgressController from "Modules/core/ProgressController";
import Settings from "Modules/core/SettingsController";
import { LanguageEnum } from "Definitions/Settings";
import { debugLog } from "./debug/Debug";
export default class MainSceneController extends Phaser.Scene {    
    private audio! : AudioController;

    private _popupController!: PopupController;

    private _backendController! : BackendController;

    private _settings! : Settings;

    private _progressController! : ProgressController;

    private _initData!: InitData;
   
    private static _instance : MainSceneController;

    public get backend() { return this._backendController; }

    public get settings() { return this._settings };

    public get progress() { return this._progressController };

    public get initData() { return this._initData; }


    public gameData : IGameData = {
        sessionId: "",
        settings: 
        {
            lang: LanguageEnum.English,
            isSfxOn: true,
            isBgmOn: true
        },
        scores:
        {
            emotion: 0,
            response: 0
        },
        progress: {
            playedMinigames: [],
            emotionalUnderstanding: {
                currentSceneState: 0,
                currentSceneIndex: -1,
                userResponses: [],
            }
        },
        results: {
            "Working Memory" : 0,
            "Spatial Reasoning": 0,
            "Linguistic Comprehension" : 0,
            "Numerical Reasoning" : 0,
            "Logical Reasoning" : 0,
            "Problem Solving" : 0,
            "Auditory Processing" : 0,
            "Emotional Understanding": 0        
        }
    }
    

    static get instance()
    {
        if (!this._instance) throw Error('Main is not initialized');

        return this._instance;
    };

    constructor() {
        
        super({ key: SceneInfo.mainScene.key });

        console.log("Main Scene Constructor")

        MainSceneController._instance = this;

    }    

    preload() { 
        console.log("ENVIRONMENT : " + CONFIG.ENVIRONMENT + " URL API: " + CONFIG.BASE_URL)

        this.audio = AudioController.instance;

        this.audio.init(this, false);   

        this._popupController = new PopupController(this);

        this._backendController = new BackendController();

        this._progressController = new ProgressController();

        this._settings = new Settings();

        this._popupController.registerOnClosePopup(() => this.ClosePopup());

       
    }


    async create() {

        window.addEventListener('offline', () => {            
            this.OpenTemplatePopup(PopupType.LostConnection);
        });

        window.addEventListener('online', () => {            
            this._popupController.closeLostConnectionPopup();            
        });

        this._backendController.token = localStorage.getItem("token");

        this._backendController.tokenExpiredDate = localStorage.getItem("tokenExpiredDate");

        await this.Init();

        this.startGame();
    }
            
    

    async startGame() { 
        console.log("Starting Game Again")      
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

                await this.Init();
            }

            return auth;
        } catch(e)
        {
            console.log(e)
            if (e instanceof Error)
            {
                this.OpenTemplatePopup(PopupType.Error, e.message);
            }

            return null;
        }
    }

    private async Init() 
    {
        console.log(this._backendController.token, this.backend.tokenExpiredDate)

        if (this._backendController.token != null && this.backend.tokenExpiredDate != null)
        {
            var expiredDate = new Date(this.backend.tokenExpiredDate);

            var now = new Date();

            console.log(expiredDate, now)

            if(expiredDate < now)
            {
                console.log("Expired")
                this._backendController.token = null;
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiredDate");
                return;
            }

            try 
            {
                var initData = await this._backendController.Init();
                
                this._initData = initData.data;

                console.log(this._initData)

                if(initData.data.savedData != null && initData.data.savedData != "")
                {
                    var data = JSON.parse(initData.data.savedData);
                    this.gameData = {...this.gameData, ...data};

                    if(this.gameData.progress.emotionalUnderstanding.userResponses == null)
                    {
                        this.gameData.progress.emotionalUnderstanding.userResponses = [];
                    }

                    console.log(this.gameData)
                }

            

                this.gameData.sessionId = initData.data.sessionId;
        
            } catch(e)
            {
                console.log(e)
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
        console.log("Closing Popup")

        this.HideAllDOMElements(false)

        this.scene.sendToBack();
    }

    public async SaveGameData()
    {        
        await this._backendController.SaveGame(this.gameData);
    }

    public OpenInfoPopup(title: string, message: string, iconKey: string, onConfirm : Function, onConfirmText: string, onCancel : Function | null = null, onCancelText: string | null = null)
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


    
}