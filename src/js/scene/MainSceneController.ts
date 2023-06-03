import { SceneInfo } from "Definitions/SceneInfo";
import PopupController, { PopupType } from "./popup/PopupController";
import AudioController from "Modules/core/AudioController";
import BackendController from "Modules/core/BackendController";
import { AuthData, Response } from "Definitions/BackendResponse";
import { gameData } from "Modules/core/GameData";
export default class MainSceneController extends Phaser.Scene {    
    private audio! : AudioController;

    private popupController!: PopupController;

    private backendController! : BackendController;

    public static _instance : MainSceneController;

    public get backend() { return this.backendController; }

    static get instance()
    {
        if (!this._instance) throw Error('Main is not initialized');

        return this._instance;
    };

    constructor() {
        
        super({ key: SceneInfo.mainScene.key });

        MainSceneController._instance = this;

    }    

    init()
    {
		

    }

    async preload() { 
        this.audio = AudioController.instance;

        this.audio.init(this, false);   

        this.popupController = new PopupController(this);

        this.backendController = new BackendController();

        this.popupController.registerOnClosePopup(() => this.ClosePopup());

       
        await this.Init();
    }


    create() {

        // this.main.popUpController = popUpController;

        // window.addEventListener('offline', () => {            
        //     popUpController.isOffline = true;
        //     popUpController.openLostConnectionPopUp(PopUpType.LOST_CONNECTION);
        // });
        // window.addEventListener('online', () => {            
        //     popUpController.isOffline = false;            
        // });
        
        this.startGame();
    }
            
    

    async startGame() {       
        this.scene.launch(SceneInfo.languageSelectorScene.key);        
    }

    public async Login(username : string, password : string, rememberUser: boolean) : Promise<Response<AuthData> | null>
    {
        try 
        {
            var auth = await this.backend.Login(username, password);

            if (auth.error == null && rememberUser)
            {
                
                localStorage.setItem("token", auth.data.token);

                localStorage.setItem("tokenExpiredDate", auth.data.tokenExpiredDate.toString());

                this.backend.token = auth.data.token;

                await this.Init();
            }
    
            return auth;
        } catch(e)
        {
            if (e instanceof Error)
            {
                this.OpenPopup(PopupType.Error, e.message);
            }

            return null;
        }
    }

    private async Init() 
    {
        this.backendController.token = localStorage.getItem("token");

        var expiredTokenDate = localStorage.getItem("tokenExpiredDate");

        if (expiredTokenDate != null)
        {
            var expiredDate = new Date(expiredTokenDate);
            var now = new Date();

            if(expiredDate < now)
            {
                this.backendController.token = null;
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiredDate");
            }
        }

        try 
        {
            var initData = await this.backendController.Init();
            gameData.sessionId = initData.data.sessionId;
    
        } catch(e)
        {
            if (e instanceof Error)
            {
                this.OpenPopup(PopupType.Error, e.message);
            }

            return null;
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
                this.OpenPopup(PopupType.Error, e.message);
            }

        }

    }

    public OpenPopup(type : PopupType, message: string = "")
    {
        this.scene.bringToTop();

        this.HideAllDOMElements();

        this.popupController.OpenPopup(type, message);
    }

    private ClosePopup()
    {
        console.log("Closing Popup")

        this.HideAllDOMElements(false)

        this.scene.sendToBack();
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