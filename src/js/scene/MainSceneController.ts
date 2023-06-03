import { SceneInfo } from "Definitions/SceneInfo";
import PopupController, { PopupType } from "./popup/PopupController";
import AudioController from "Modules/core/AudioController";
import BackendController from "Modules/core/BackendController";
import { AuthResponse } from "Definitions/BackendResponse";
export default class MainSceneController extends Phaser.Scene {    
    private audio! : AudioController;

    private popupController!: PopupController;

    private backendController! : BackendController;

    public static _instance : MainSceneController;

    private _token : string | null = "";

    public get authToken() { return this._token; }

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

    preload() { 
        this.load.plugin(
            'rexinputtextplugin', 
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', 
            true
        );

        this.audio = AudioController.instance;

        this.audio.init(this, false);   

        this.popupController = new PopupController(this);

        this._token = localStorage.getItem("token");

        this.backendController = new BackendController();

        this.popupController.registerOnClosePopup(() => this.ClosePopup());
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
        
        const queryString = window.location.search;

        if (queryString) {
            this.checkTokenToSetPassword(queryString);
        }
        else {
             this.startGame();
        }
    }

    async startGame() {       
            
        
        this.scene.launch(SceneInfo.languageSelectorScene.key);


        return;

        // if (refreshToken) 
        // {                         
        //     const restApi = this.main.apiController;
        //     const asyncHelper = this.main.asyncHelper;

        //     //#region Global Error
		// 	 asyncHelper.setPopUP(this);
		// 	 asyncHelper.popUpController.globalPopup.registerPopUpClose(() => {
        //         // window.localStorage.clear();
        //         this.scene.launch(SceneInfo.loginScene.key);
		// 	 })        
		// 	 //#endregion

        //     const response = await asyncHelper.nonFailingRequestAsync(() => restApi.authLoginFromToken(refreshToken));
            
        //     if (response) {
        //         window.localStorage.setItem("refreshToken", response.data.refreshToken);
                
        //         restApi.authorizationToken = response.data.token;
        //         GameData.PLAYER.fullName = response.data.fullName;
        //         GameData.PLAYER.authorizationToken = response.data.token;
        //         GameData.PLAYER.hasPlayed = response.data.hasPlayed;                
                
        //         var spaceIdx = GameData.PLAYER.fullName.indexOf(' ');
        //         var firstName;
        //         if (spaceIdx != -1) {
        //             firstName = GameData.PLAYER.fullName.substring(0, spaceIdx);
        //         }
        //         else {
        //             firstName = GameData.PLAYER.fullName;
        //         }                
        //         GameData.PLAYER.firstName = firstName;
        //         this.scene.launch(SceneInfo.selectLanguageScene.key);
        //         return;
        //     }
        // }

        // this.scene.launch(SceneInfo.loginScene.key);
    }

    async checkTokenToSetPassword(queryString : string) { 
        /**       
        const restApi = this.main.apiController;
        const asyncHelper = this.main.asyncHelper;        

        const urlParams = new URLSearchParams(queryString);        
        const token = urlParams.get('token');
        const action = urlParams.get('action');
        
        const request = token;        

        //#region Global Error
        asyncHelper.setPopUP(this);        
        asyncHelper.popUpController.globalPopup.registerPopUpClose(() => {
            this.scene.launch(SceneInfo.loginScene.key);
        });
        //#endregion
        const res = await asyncHelper.nonFailingRequestAsync(() => restApi.checkTokenToSetPassword(request));
        
        if (!res) {
            this.scene.launch(SceneInfo.tokenScene.key);
        }
        else {
            GameData.PLAYER.setPasswordToken = token;
            
            if (action === 'SET_PASSWORD' || action === 'RESET_PASSWORD') {
                this.scene.launch(SceneInfo.createNewPasswordScene.key);
            }
        }  
        */              
    }

    public async Login(username : string, password : string, rememberUser: boolean) : Promise<AuthResponse | null>
    {
        try 
        {
            var auth = await this.backend.Login(username, password);

            if (auth.error == null && rememberUser)
            {
                
                localStorage.setItem("token", auth.data.token);

                this._token = auth.data.token;
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