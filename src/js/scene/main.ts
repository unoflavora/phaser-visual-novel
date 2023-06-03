import MainSceneController from "./MainSceneController";
import PopupController, { PopupType } from "./popup/PopupController";
import BackendController from "Modules/core/BackendController";
import { AuthResponse } from "Definitions/BackendResponse";
import AudioController from "Modules/core/AudioController";
import { SceneInfo } from "Definitions/SceneInfo";

export default class Main
{
    static inst : Main;

    static get instance()
    {
        if (!Main.inst) throw Error('Main is not initialized');

        return Main.inst;
    };

    private popupController: PopupController;
    private backendController : BackendController;

    private _token : string | null = "";

    public get authToken() { return this._token; }

    public get backend() { return this.backendController; }

    scene : MainSceneController;

    constructor(scene : MainSceneController) 
    {
        Main.inst = this;

        this.scene = scene;

        this.popupController = new PopupController(scene);

        this._token = localStorage.getItem("token");

        this.backendController = new BackendController();

        this.popupController.registerOnClosePopup(() => this.ClosePopup());
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

            var scenes = this.scene.scene.manager.getScenes();
    
            var loadedScene = scenes.filter(scene => scene.scene.key != SceneInfo.mainScene.key && scene.scene.key != SceneInfo.debugScene.key)
    
            // remove the currently loaded scene
            loadedScene.forEach(scene => this.scene.scene.stop(scene.scene.key))
    
            AudioController.instance.stopBGM();
            // load the login scene
            this.scene.scene.launch(SceneInfo.loginScene.key);
    
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
        this.scene.scene.bringToTop();

        this.HideAllDOMElements();

        this.popupController.OpenPopup(type, message);
    }

    private ClosePopup()
    {
        console.log("Closing Popup")

        this.HideAllDOMElements(false)

        this.scene.scene.sendToBack();
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